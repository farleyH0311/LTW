import { Controller, Get, Query } from '@nestjs/common';
import { CareScoreService } from './care-score.service';

@Controller('care-score')
export class CareScoreController {
  constructor(private readonly service: CareScoreService) {}

  @Get()
  async getScore(
    @Query('userId') userId: string,
    @Query('partnerId') partnerId: string
  ) {
    const score = await this.service.calculate(+userId, +partnerId);
    return { careScore: score };
  }
}
