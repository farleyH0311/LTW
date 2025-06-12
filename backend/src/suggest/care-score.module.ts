import { Module } from '@nestjs/common';
import { CareScoreController } from './care-score.controller';
import { CareScoreService } from './care-score.service';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CareScoreController],
  providers: [CareScoreService],
  exports: [CareScoreService], // để module khác (vd: dating-advice) sử dụng
})
export class CareScoreModule {}
