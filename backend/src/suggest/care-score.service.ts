import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CareScoreService {
  constructor(private prisma: PrismaService) {}

  async calculate(userId: number, partnerId: number): Promise<number> {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: userId, user2Id: partnerId },
          { user1Id: partnerId, user2Id: userId },
        ],
      },
      include: {
        messages: { orderBy: { timestamp: 'desc' }, take: 50 },
      },
    });

    if (!conversation) return 0;

    const messages = conversation.messages;

    // Score logic ví dụ:
    let score = 0;
    for (const msg of messages) {
      if (msg.senderId === partnerId) score += 2; // mỗi tin nhắn từ người kia
      if (msg.content.includes('?')) score += 1; // câu hỏi
      if (msg.content.length > 50) score += 1; // chi tiết
    }

    return Math.min(100, score); // tối đa 100 điểm
  }
}
