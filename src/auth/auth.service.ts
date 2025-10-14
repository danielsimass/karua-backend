import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(loginDto: LoginDto): Promise<User> {
    let user = await this.usersService.findByEmail(loginDto.username);
    if (!user) {
      user = await this.usersService.findByUsername(loginDto.username);
    }
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Usuário inativo');
    }
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return user;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; user: AuthResponseDto }> {
    const user = await this.validateUser(loginDto);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      hostId: user.hostId,
    };

    const accessToken = this.jwtService.sign(payload);

    const authResponse: AuthResponseDto = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      hostId: user.hostId,
      hostName: user.host.name,
    };

    return {
      accessToken,
      user: authResponse,
    };
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  async refreshToken(userId: string, hostId: string): Promise<{ accessToken: string }> {
    const user = await this.usersService.findOne(userId, hostId);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuário inativo ou não encontrado');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      hostId: user.hostId,
    };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
