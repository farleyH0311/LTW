import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Res,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  Put,
  Patch,
} from '@nestjs/common';
import { users } from '@prisma/client';
import {
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './dto/auth.dto';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guard/refresh-token.guard';
import { Response } from 'express';
import { AccessTokenGuard } from './guard/access-token.guard';
import { VerifyOtpDto, SendOtpDto } from './dto/otp.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto): Promise<any> {
    try {
      return await this.authService.register(body);
    } catch (error) {
      throw error;
    }
  }
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ userId: number; accessToken: string }> {
    const result = await this.authService.login(body);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      userId: result.userId,
      accessToken: result.accessToken,
    };
  }
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    res.clearCookie('userId', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    return { message: 'Logged out successfully' };
  }
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      const accessToken = await this.jwtService.signAsync(
        { id: payload.id, email: payload.email },
        {
          secret: process.env.ACCESS_TOKEN_KEY,
          expiresIn: '1h',
        },
      );

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    await this.authService.verifyOtp(dto.email, dto.otp);
    return { message: 'Email verified successfully.' };
  }
  @Post('google-login')
  @HttpCode(HttpStatus.OK)
  async googleLogin(
    @Body('idToken') idToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string; user: any }> {
    if (!idToken) {
      throw new UnauthorizedException('idToken không được để trống');
    }
    try {
      const result = await this.authService.loginWithGoogle(idToken);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      return {
        accessToken: result.accessToken,
        user: result.user,
      };
    } catch (error) {
      console.error('Lỗi loginWithGoogle:', error);
      throw error;
    }
  }

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() dto: SendOtpDto) {
    const { email } = dto;
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    await this.authService.sendOtp(email);
    return { message: 'OTP has been sent to your email.' };
  }
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const { email, newPassword, confirmPassword } = dto;

    if (!email || !newPassword || !confirmPassword) {
      throw new BadRequestException('Email and passwords are required');
    }
    if (newPassword !== confirmPassword) {
      throw new BadRequestException(
        'Password and confirm password do not match',
      );
    }
    await this.authService.resetPassword(email, newPassword);
    return { message: 'Password has been updated successfully' };
  }
  @UseGuards(AccessTokenGuard)
  @Patch('change-password')
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    console.log('Request user:', req.user);

    if (!req.user) {
      throw new UnauthorizedException('User info not found in request');
    }

    const userId = req.user.id;

    return this.authService.changePassword(
      userId,
      dto.oldPassword,
      dto.newPassword,
    );
  }
}
