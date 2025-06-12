import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { VertexService } from '../vertex/vertex.service';
//import { CareScoreService } from './care-score.service';

@Injectable()
export class DatingAdviceService {
  constructor(
    private prisma: PrismaService,
    private vertex: VertexService,
     //private care: CareScoreService
  ) {}

  async generateAdviceWithPrompt(userId: number, partnerId: number, question: string): Promise<string> {
  const [userProfile, partnerProfile] = await Promise.all([
    this.prisma.profile.findUnique({ where: { userId } }),
    this.prisma.profile.findUnique({ where: { userId: partnerId } }),
  ]);

  if (!userProfile || !partnerProfile) {
    return 'Không tìm thấy hồ sơ của bạn hoặc đối phương.';
  }

  const conversation = await this.prisma.conversation.findFirst({
    where: {
      OR: [
        { user1Id: userId, user2Id: partnerId },
        { user1Id: partnerId, user2Id: userId },
      ],
    },
    include: {
      messages: {
        orderBy: { timestamp: 'desc' },
        take: 20,
        include: { sender: { select: { profile: true } } },
      },
    },
  });

  if (!conversation) return 'Chưa có cuộc trò chuyện nào.';

  
  const formatInterests = (arr?: string[]) =>
  Array.isArray(arr) ? arr.join(', ') : 'Chưa cung cấp';

  const chatLog = conversation.messages
    .reverse()
    .map((m) => `${m.sender.profile?.name || 'Ẩn danh'}: ${m.content}`)
    .join('\n');

  const prompt = `Bạn là chuyên gia tâm lý. Dưới đây là hồ sơ hai người và đoạn chat gần đây:

🔸 Hồ sơ người A:
- Tên: ${userProfile.name}
- Tuổi: ${userProfile.age}
- Nghề nghiệp: ${userProfile.occupation || 'Chưa cung cấp'}
- Mục tiêu: ${userProfile.relationship_goals || 'Không rõ'}
- Sở thích: ${userProfile.interests.join(', ')}
- Sở thích: ${formatInterests(userProfile.interests)}

🔸 Hồ sơ người B:
- Tên: ${partnerProfile.name}
- Tuổi: ${partnerProfile.age}
- Nghề nghiệp: ${partnerProfile.occupation || 'Chưa cung cấp'}
- Mục tiêu: ${partnerProfile.relationship_goals || 'Không rõ'}
- Sở thích: ${partnerProfile.interests.join(', ')}

🗨️ Đoạn hội thoại gần đây:
${chatLog}

🧠 Câu hỏi từ người dùng: "${question}"

👉 Dựa vào trên, hãy đưa ra phản hồi tự nhiên và súc tích nhất.`;
  
  return this.vertex.ask(prompt);
}
}
