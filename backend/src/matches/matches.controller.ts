import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { MatchResultDto } from './dto/matches.dto';
import { MatchesService } from './matches.service';
import { AccessTokenGuard } from '../auth/guard/access-token.guard';
import { BadRequestException } from '@nestjs/common';
@UseGuards(AccessTokenGuard)
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get('suggested/:userId')
  async getSuggestedMatches(
    @Param('userId') userId: string,
    @Query('limit') limit?: string,
  ): Promise<MatchResultDto[]> {
    const parsedId = parseInt(userId, 10);
    if (!parsedId || isNaN(parsedId)) {
      throw new BadRequestException('Invalid userId');
    }

    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.matchesService.getSuggestedMatches(parsedId, limitNum);
  }

  @Get('compatibility/:userId')
  async getCompatibilityForUsers(
    @Param('userId') userId: string,
    @Query('candidateIds') candidateIds: string,
  ): Promise<MatchResultDto[]> {
    if (!candidateIds) return [];
    const ids = candidateIds.split(',').map((id) => parseInt(id, 10));
    return this.matchesService.getCompatibilityForUsers(+userId, ids);
  }

  @Post('like')
  async likeUser(
   @Body() body: { senderId: number; receiverId: number },
  ): Promise<void> {
    const { senderId, receiverId } = body;
    return this.matchesService.likeUser(senderId, receiverId);
  }

  @Delete('cancel')
  async cancelLike(
    @Query('senderId') senderId: string,
    @Query('receiverId') receiverId: string,
  ): Promise<void> {
    return this.matchesService.cancelLike(+senderId, +receiverId);
  }

  @Delete('reject')
  async rejectUser(
    @Query('receiverId') receiverId: string,
    @Query('senderId') senderId: string,
  ): Promise<void> {
    return this.matchesService.rejectUser(+receiverId, +senderId);
  }

  @Get('my-matches/:userId')
  async getMyMatches(
    @Param('userId') userId: string,
  ): Promise<MatchResultDto[]> {
    return this.matchesService.getMyMatches(+userId);
  }

  @Delete('unmatch')
  async unmatchUsers(
    @Query('userId1') userId1: string,
    @Query('userId2') userId2: string,
  ): Promise<void> {
    return this.matchesService.unmatchUsers(+userId1, +userId2);
  }

  @Get('incoming/:userId')
  async getIncomingLikes(
    @Param('userId') userId: string,
  ): Promise<MatchResultDto[]> {
    const parsedId = parseInt(userId, 10);
    if (!parsedId || isNaN(parsedId)) {
      throw new BadRequestException('Invalid or missing userId');
    }
    return this.matchesService.getIncomingLikes(parsedId);
  }

  @Get('sent/:userId')
  async getSentLikes(
    @Param('userId') userId: string,
  ): Promise<MatchResultDto[]> {
    return this.matchesService.getSentLikes(+userId);
  }

  @Get('my-matches-with-interests/:userId')
  async getMyMatchesWithInterests(
    @Param('userId') userId: string,
  ): Promise<MatchResultDto[]> {
    return this.matchesService.getMyMatchesWithInterests(+userId);
  }

}
