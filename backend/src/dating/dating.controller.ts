import { Controller, Post, Body, Param, Get, Patch,Query, BadRequestException } from '@nestjs/common';
import { DatingService } from './dating.service';
import { CreateDateDto, UpdateDateStatusDto, RateDateDto } from './dto/date.dto';

@Controller('dating')
export class DatingController {
  constructor(private readonly datingService: DatingService) {}

  @Post()
  createDate(@Body() body: CreateDateDto) {
    return this.datingService.createDate(body);
  }

  @Get(':userId')
  getMyDates(@Param('userId') userId: string) {
    return this.datingService.getMyDates(+userId);
  }

  @Patch(':dateId')
  updateDateStatus(
    @Param('dateId') dateId: string,
    @Body() body: UpdateDateStatusDto,
    @Query('userId') userId: string, 
  ) {
    if (!userId) throw new BadRequestException('userId is required');
    return this.datingService.updateDateStatus(+dateId, body.status, +userId);
  }


  @Patch('rate/:dateId')
  rateDate(
    @Param('dateId') dateId: string,
    @Body() body: RateDateDto,
  ) {
    return this.datingService.rateDate(+dateId, body.userId, body.rating);
  }
}