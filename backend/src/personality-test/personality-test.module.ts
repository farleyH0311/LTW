import { Module } from '@nestjs/common';
import { PersonalityTestController } from './personality-test.controller';
import { PersonalityTestService } from './personality-test.service';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PersonalityTestController],
  providers: [PersonalityTestService, PrismaService],
})
export class PersonalityTestModule {}
