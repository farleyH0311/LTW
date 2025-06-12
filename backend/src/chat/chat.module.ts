// backend/src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma.service';
import { AccessTokenGuard } from '../auth/guard/access-token.guard';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '24h'
        },
      }),
    }),
  ],
  controllers: [ChatController],
  providers: [
    ChatService, 
    PrismaService,
    AccessTokenGuard,
  ],
  exports: [ChatService], // Export in case other modules need it
})
export class ChatModule {}