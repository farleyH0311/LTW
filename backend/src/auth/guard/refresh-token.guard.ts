import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const refreshToken =
      request.cookies?.refresh_token ||
      request.headers['authorization']?.split(' ')[1];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      request['user'] = payload;

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
