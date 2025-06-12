// backend/src/chat/chat.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getUserConversations(currentUserId: number) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [
          { user1Id: currentUserId },
          { user2Id: currentUserId },
        ],
      },
      include: {
        user1: { include: { profile: true } },
        user2: { include: { profile: true } },
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1,
          select: {
            content: true,
            timestamp: true,
            senderId: true,
          },
        },
      },
    });

    return conversations.map((c) => {
      const other = c.user1Id === currentUserId ? c.user2 : c.user1;
      const lastMessage = c.messages[0] || null;

      return {
        id: other.id,
        name: other.profile?.name ?? `User ${other.id}`,
        avatar: other.profile?? null,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          timestamp: lastMessage.timestamp,
          isFromMe: lastMessage.senderId === currentUserId,
        } : null,
      };
    });
  }

  async getMessages(currentUserId: number, otherUserId: number) {
    // Find or create conversation
    let conversation = await this.prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: currentUserId, user2Id: otherUserId },
          { user1Id: otherUserId, user2Id: currentUserId },
        ],
      },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: { 
          user1Id: Math.min(currentUserId, otherUserId),
          user2Id: Math.max(currentUserId, otherUserId)
        },
      });
    }

    // Get messages for this conversation
    return this.prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { timestamp: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                name: true,
                
              },
            },
          },
        },
      },
    });
  }

  async sendMessage(currentUserId: number, otherUserId: number, content: string) {
    // Find or create conversation
    let conversation = await this.prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: currentUserId, user2Id: otherUserId },
          { user1Id: otherUserId, user2Id: currentUserId },
        ],
      },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: { 
          user1Id: Math.min(currentUserId, otherUserId),
          user2Id: Math.max(currentUserId, otherUserId)
        },
      });
    }

    // Create the message
    const message = await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: currentUserId,
        content: content.trim(),
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                name: true,
                
              },
            },
          },
        },
      },
    });

    return message;
  }
}