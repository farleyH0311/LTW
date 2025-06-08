import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { AccessTokenGuard } from './guard/access-token.guard';
import { EmailModule } from '../email/email.module';
import { GoogleAuthService } from './google-auth.service';
@Module({
  imports: [
    EmailModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_KEY,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    JwtService,
    AccessTokenGuard,
    GoogleAuthService,
  ],
  exports: [JwtModule, AccessTokenGuard, GoogleAuthService],
})
export class AuthModule {}
