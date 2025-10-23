import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../users/entities/user.entity';
import { SecureCodeUtil } from '../common/utils';

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

    // Se o usuário não tem senha, não pode fazer login normal
    if (!user.password) {
      throw new UnauthorizedException('Usuário precisa definir senha no primeiro acesso');
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
      isFirstLogin: user.isFirstLogin,
      requiresPasswordSetup: !user.password,
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

  async checkFirstLogin(username: string): Promise<{ requiresPasswordSetup: boolean }> {
    let user = await this.usersService.findByEmail(username);
    if (!user) {
      user = await this.usersService.findByUsername(username);
    }
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Usuário inativo');
    }

    return {
      requiresPasswordSetup: !user.password,
    };
  }

  async setFirstPassword(
    username: string,
    password: string,
    secureCode: string
  ): Promise<{ accessToken: string; user: AuthResponseDto }> {
    let user = await this.usersService.findByEmail(username);
    if (!user) {
      user = await this.usersService.findByUsername(username);
    }
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Usuário inativo');
    }
    if (user.password) {
      throw new UnauthorizedException(
        'Usuário já possui senha definida. Use o fluxo de login normal.'
      );
    }

    // Verifica se o usuário possui um código seguro
    if (!user.secureCode) {
      throw new UnauthorizedException(
        'Código de verificação não foi gerado. Solicite um novo convite.'
      );
    }

    // Valida o código seguro
    const isCodeValid = await SecureCodeUtil.verifyCode(secureCode, user.secureCode);
    if (!isCodeValid) {
      throw new UnauthorizedException('Código de verificação inválido');
    }

    // Define a nova senha e limpa o código seguro
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.isFirstLogin = false;
    user.secureCode = undefined; // Remove o código após uso
    await this.usersService.updateUserPassword(user);

    // Gera o token e retorna
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
      isFirstLogin: false,
      requiresPasswordSetup: false,
    };

    return {
      accessToken,
      user: authResponse,
    };
  }
}
