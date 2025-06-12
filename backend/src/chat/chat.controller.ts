// backend/src/chat/chat.controller.ts
import { 
  Controller,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  UseGuards,
  Req
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AccessTokenGuard } from '../auth/guard/access-token.guard';

@Controller('chat')
@UseGuards(AccessTokenGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  /** GET /api/chat/conversations */
  @Get('conversations')
  async getUserConversations(@Req() req) {
    const currentUserId = req.user.id;
    return this.chatService.getUserConversations(currentUserId);
  }

  /** GET /api/chat/:userId/messages */
  @Get(':userId/messages')
  async fetchMessages(
    @Req() req,
    @Param('userId', ParseIntPipe) otherUserId: number,
  ) {
    const currentUserId = req.user.id;
    return this.chatService.getMessages(currentUserId, otherUserId);
  }

  /** POST /api/chat/:userId/messages */
  @Post(':userId/messages')
  async postMessage(
    @Req() req,
    @Param('userId', ParseIntPipe) otherUserId: number,
    @Body('content') content: string,
  ) {
    const currentUserId = req.user.id;
    
    if (!content?.trim()) {
      throw new HttpException('Content cannot be empty', HttpStatus.BAD_REQUEST);
    }
    
    return this.chatService.sendMessage(currentUserId, otherUserId, content);
  }
}