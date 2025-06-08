import {
  HttpException,
  HttpStatus,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RegisterDto } from './dto/auth.dto';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { EmailService } from '../email/email.service';
import { GoogleAuthService } from './google-auth.service';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private googleAuthService: GoogleAuthService,
    private prismaService: PrismaService,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  private generateOtp(length = 6): string {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  }

  async register(
    userData: RegisterDto,
  ): Promise<{ userId: number; emailSent: boolean }> {
    const existingUser = await this.prismaService.users.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new HttpException(
        'This email has been used.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (userData.password !== userData.cf_password) {
      throw new HttpException(
        'Confirm password does not match.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await hash(userData.password, 10);

    const createdUser = await this.prismaService.users.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        isVerified: false,
      },
    });

    const otpToken = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prismaService.otp.create({
      data: {
        token: otpToken,
        userId: createdUser.id,
        type: 'verify_email',
        expiresAt,
      },
    });

    try {
      await this.emailService.sendEmail({
        recipients: [createdUser.email],
        subject: 'Verify your email with OTP',
        text: `Your verification OTP is: ${otpToken}. It expires in 10 minutes.`,
        html: `<p>Your verification OTP is: <b>${otpToken}</b>. It expires in 10 minutes.</p>`,
      });
    } catch (error) {
      console.error('Failed to send verification email:', error);
      await this.prismaService.users.delete({ where: { id: createdUser.id } });
      throw new HttpException(
        'Failed to send verification email.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      userId: createdUser.id,
      emailSent: true,
    };
  }

  async verifyOtp(email: string, otp: string): Promise<void> {
    const user = await this.prismaService.users.findUnique({
      where: { email },
      include: {
        otp: {
          where: {
            token: otp,
            //type: 'verify_email',
            expiresAt: {
              gt: new Date(),
            },
          },
        },
      },
    });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.BAD_REQUEST);
    }

    if (!user.otp || user.otp.length === 0) {
      throw new HttpException(
        'Invalid or expired OTP.',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prismaService.users.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    await this.prismaService.otp.deleteMany({
      where: {
        userId: user.id,
        type: 'verify_email',
      },
    });
  }

  login = async (data: { email: string; password: string }): Promise<any> => {
    const user = await this.prismaService.users.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new HttpException(
        { message: 'Account does not exist.' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!user.isVerified) {
      throw new HttpException(
        { message: 'Email is not verified yet.' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const verify = await compare(data.password, user.password);

    if (!verify) {
      throw new HttpException(
        { message: 'Password is not correct.' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { id: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: '1h',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: '7d',
    });

    return {
      userId: user.id,
      accessToken,
      refreshToken,
    };
  };
  async loginWithGoogle(idToken: string) {
    try {
      const googleUser = await this.googleAuthService.verifyIdToken(idToken);
      // console.log('googleUser:', googleUser);

      if (!googleUser.email) {
        throw new UnauthorizedException('Google user email not found');
      }

      let user = await this.prismaService.users.findUnique({
        where: { email: googleUser.email },
      });

      if (!user) {
        user = await this.prismaService.users.create({
          data: {
            email: googleUser.email,
            isVerified: true,
            password: '',
            profile: {
              create: {
                name: googleUser.name || 'unknown',
                avt: googleUser.picture || 'unknown',
                age: 18,
                gender: '',
                location: '',
              },
            },
          },
          include: {
            profile: true,
          },
        });
      }

      const payload = { id: user.id, email: user.email };
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: '1h',
      });
      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: '7d',
      });

      return { accessToken, refreshToken, user };
    } catch (error) {
      console.error('Lỗi trong loginWithGoogle:', error);
      throw new UnauthorizedException('Google login failed');
    }
  }
  async sendOtp(email: string) {
    const user = await this.prismaService.users.findUnique({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('User with this email does not exist.');
    }

    const otpToken = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    try {
      await this.prismaService.otp.create({
        data: {
          token: otpToken,
          userId: user.id,
          type: 'forgot_password',
          expiresAt,
        },
      });

      await this.emailService.sendEmail({
        recipients: [email],
        subject: 'Forgot password',
        text: `Your OTP is: ${otpToken}. It expires in 10 minutes.`,
        html: `<p>Your OTP is: <b>${otpToken}</b>. It expires in 10 minutes.</p>`,
      });
    } catch (error) {
      console.error('Failed to send OTP or save to DB:', error);
      throw new HttpException(
        'Failed to send OTP.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async resetPassword(email: string, newPassword: string): Promise<any> {
    const user = await this.prismaService.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException(
        'Email không tồn tại trong hệ thống',
        HttpStatus.NOT_FOUND,
      );
    }

    const hashedPassword = await hash(newPassword, 10);

    const updatedUser = await this.prismaService.users.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return updatedUser;
  }
  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.prismaService.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const passwordValid = await compare(oldPassword, user.password);
    if (!passwordValid) {
      throw new HttpException(
        'Old password is incorrect.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newHashed = await hash(newPassword, 10);

    await this.prismaService.users.update({
      where: { id: userId },
      data: { password: newHashed },
    });

    return { message: 'Password changed successfully.' };
  }
}
