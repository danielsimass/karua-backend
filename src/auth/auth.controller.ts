import { Controller, Post, Body, HttpCode, HttpStatus, Res, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { SetFirstPasswordDto } from './dto/set-first-password.dto';
import { Public } from './decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realizar login' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthResponseDto> {
    const { accessToken, user } = await this.authService.login(loginDto);
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });
    return user;
  }

  @Post('logout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Realizar logout' })
  @ApiResponse({ status: 204, description: 'Logout realizado com sucesso' })
  logout(@Res({ passthrough: true }) response: Response): void {
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter informações do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Informações do usuário', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  getMe(@Req() request: Request): Record<string, unknown> {
    return request.user as Record<string, unknown>;
  }

  @Post('refresh')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar token de acesso' })
  @ApiResponse({ status: 200, description: 'Token renovado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ): Promise<{ message: string }> {
    const user = request.user as { userId: string; hostId: string };
    const { accessToken } = await this.authService.refreshToken(user.userId, user.hostId);
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    return { message: 'Token renovado com sucesso' };
  }

  @Public()
  @Post('check-first-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verifica se o usuário precisa definir senha no primeiro acesso' })
  @ApiResponse({
    status: 200,
    description: 'Status de primeiro login verificado',
    schema: {
      type: 'object',
      properties: {
        requiresPasswordSetup: { type: 'boolean', example: true },
        userId: { type: 'string', example: 'uuid-user-id' },
        name: { type: 'string', example: 'João Silva' },
        email: { type: 'string', example: 'joao.silva@example.com' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Usuário não encontrado ou inativo' })
  async checkFirstLogin(@Body() body: { username: string; securityCode: string }): Promise<{
    requiresPasswordSetup: boolean;
  }> {
    return this.authService.checkFirstLogin(body.username);
  }

  @Public()
  @Post('set-first-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Define a senha no primeiro acesso e realiza login automático' })
  @ApiResponse({
    status: 200,
    description: 'Senha definida e login realizado com sucesso',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Usuário não encontrado, inativo ou já possui senha' })
  async setFirstPassword(
    @Body() setFirstPasswordDto: SetFirstPasswordDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthResponseDto> {
    const { accessToken, user } = await this.authService.setFirstPassword(
      setFirstPasswordDto.username,
      setFirstPasswordDto.password,
      setFirstPasswordDto.secureCode
    );
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });
    return user;
  }
}
