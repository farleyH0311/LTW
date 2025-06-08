import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { UserGateway } from './user.gateway';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, UserGateway],
})
export class UserModule {}
