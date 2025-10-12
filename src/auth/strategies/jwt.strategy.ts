import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import type { Request } from 'express';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request?.cookies?.['access_token'];
          return token || null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findOne(payload.sub, payload.hostId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuário inativo ou não encontrado');
    }
    return {
      userId: payload.sub,
      email: payload.email,
      username: payload.username,
      role: payload.role,
      hostId: payload.hostId,
    };
  }
}
