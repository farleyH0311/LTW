import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PostsController } from './post/post.controller';
import { PostsService } from './post/post.service';
import { PostsModule } from './post/post.module';
import { PrismaService } from './prisma.service';
import { PersonalityTestModule } from './personality-test/personality-test.module';
import { MatchesModule } from './matches/matches.module';
import { NotificationModule } from './notification/notification.module';
import { DatingModule } from './dating/dating.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    PostsModule,
    PersonalityTestModule,
    MatchesModule,
    NotificationModule,
    DatingModule,
  ],
  controllers: [AppController, PostsController],
  providers: [AppService, PostsService, PrismaService],
})
export class AppModule {}
