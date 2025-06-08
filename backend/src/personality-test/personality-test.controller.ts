import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PersonalityTestService } from './personality-test.service';
import { CreatePersonalityTestDto } from './dto/personality-test.dto';
import { AccessTokenGuard } from '../auth/guard/access-token.guard';
@UseGuards(AccessTokenGuard)
@Controller('personality-test')
export class PersonalityTestController {
  constructor(private readonly testService: PersonalityTestService) {}

  @Post()
  async createTest(
    @Request() req,
    @Body() createDto: CreatePersonalityTestDto,
  ) {
    const userId = req.user.id;
    return await this.testService.createTestResult(userId, createDto);
  }

  @Get()
  async getMyTests(@Request() req) {
    const userId = req.user.id;
    return await this.testService.getTestsByUser(userId);
  }

  //   @Get(':id')
  //   async getTestById(@Param('id') id: string) {
  //     return await this.testService.getTestById(Number(id));
  //   }
  @Get(':userId')
  async getLatestTestByUser(@Param('userId') userId: string) {
    return await this.testService.getLatestTestByUser(Number(userId));
  }
}
