import { Module } from '@nestjs/common';
import { PostsService } from './post.service';
import { PostsController } from './post.controller';
import { PrismaService } from 'src/prisma.service';

import { AuthModule } from '../auth/auth.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [AuthModule, NotificationModule ],
  controllers: [PostsController],
  providers: [PostsService, PrismaService],
})
export class PostsModule {}
