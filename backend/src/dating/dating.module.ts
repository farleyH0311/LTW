import { Module } from '@nestjs/common';
import { DatingService } from './dating.service';
import { DatingController } from './dating.controller';
import { PrismaService } from '../prisma.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [DatingController],
  providers: [DatingService, PrismaService],
})
export class DatingModule {}