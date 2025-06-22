import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MatchResultDto } from './dto/matches.dto';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class MatchesService {
  constructor(
    private readonly prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async getSuggestedMatches(userId: number, limit = 20): Promise<MatchResultDto[]> {
  const userProfile = await this.prisma.profile.findUnique({
    where: { userId },
  });

  if (!userProfile) {
    throw new NotFoundException('Không tìm thấy hồ sơ người dùng.');
  }

  if (!userProfile.relationship_goals) {
    throw new BadRequestException('Người dùng chưa chọn mục tiêu mối quan hệ.');
  }

    const [sentLikes, matched] = await Promise.all([
      this.prisma.connection_queue.findMany({
        where: { senderId: userId },
        select: { receiverId: true },
      }),
      this.prisma.connection.findMany({
        where: {
          OR: [{ userAId: userId }, { userBId: userId }],
        },
        select: { userAId: true, userBId: true },
      }),
    ]);

    const excludedIds = new Set<number>();
    sentLikes.forEach((like) => excludedIds.add(like.receiverId));
    matched.forEach((conn) => {
      excludedIds.add(conn.userAId);
      excludedIds.add(conn.userBId);
    });
    excludedIds.delete(userId);

    const candidates = await this.prisma.profile.findMany({
      where: {
        userId: {
          not: userId,
          notIn: Array.from(excludedIds),
        },
      },
      take: limit,
      include: {
        user: {
          select: {
            is_online: true,
            last_online_at: true,
          },
        },
      },
    });

    const results: MatchResultDto[] = [];
    for (const candidate of candidates) {
      const detail = await this.computeCompatibility(userId, candidate.userId);
      results.push({
        profile: {
          ...candidate,
          is_online: candidate.user.is_online,
          last_online_at: candidate.user.last_online_at,
        },
        compatibility: detail,
      });
    }

    results.sort((a, b) => b.compatibility.totalScore - a.compatibility.totalScore);
    return results;
  }

  async likeUser(senderId: number, receiverId: number): Promise<void> {
    if (senderId === receiverId) throw new Error('Cannot like yourself');

    const existing = await this.prisma.connection_queue.findFirst({
      where: { senderId, receiverId },
    });
    if (existing) return;

    const senderProfile = await this.prisma.profile.findUnique({
      where: { userId: senderId },
      select: { name: true },
    });
    const name = senderProfile?.name || 'Người dùng';

    const reverseLike = await this.prisma.connection_queue.findFirst({
      where: { senderId: receiverId, receiverId: senderId },
    });

    if (reverseLike) {
       await this.prisma.$transaction([
    this.prisma.connection_queue.delete({ where: { id: reverseLike.id } }),
    this.prisma.connection.create({
      data: { userAId: senderId, userBId: receiverId },
    }),
  ]);
    // 1. Check if a conversation already exists between these two users
const existingConversation = await this.prisma.conversation.findFirst({
  where: {
    OR: [
      { user1Id: senderId, user2Id: receiverId },
      { user1Id: receiverId, user2Id: senderId },
    ],
  },
});

// 2. Create conversation if not exists
if (!existingConversation) {
  await this.prisma.conversation.create({
    data: {
      user1Id: senderId,
      user2Id: receiverId,
    },
  });
}

    const sender = await this.prisma.profile.findUnique({ where: { userId: senderId }, select: { name: true } });
    const receiver = await this.prisma.profile.findUnique({ where: { userId: receiverId }, select: { name: true } });

    const senderName = sender?.name || 'người dùng';
    const receiverName = receiver?.name || 'người dùng';

    // Gửi thông báo cho receiver
    await this.notificationService.create({
      userId: receiverId,
      content: `Bạn đã kết nối thành công với ${senderName}!`,
      url: `/profile/${senderId}`,
      type: 'match_success',
    });

    // Gửi thông báo cho sender
    await this.notificationService.create({
      userId: senderId,
      content: `Bạn đã kết nối thành công với ${receiverName}!`,
      url: `/profile/${receiverId}`,
      type: 'match_success',
    });
    } else {
      await this.prisma.connection_queue.create({
        data: { senderId, receiverId },
      });

      await this.notificationService.create({
        userId: receiverId,
        content: `${name} đã thích bạn!`,
        url: `/profile/${senderId}`,
        type: 'waiting_match',
      });
    }
  }

  async unmatchUsers(userId1: number, userId2: number): Promise<void> {
    await this.prisma.connection.deleteMany({
      where: {
        OR: [
          { userAId: userId1, userBId: userId2 },
          { userAId: userId2, userBId: userId1 },
        ],
      },
    });

    const unmatcherProfile = await this.prisma.profile.findUnique({
      where: { userId: userId1 },
      select: { name: true },
    });
    const name = unmatcherProfile?.name || 'Người dùng';

    await this.notificationService.create({
      userId: userId2,
      content: `${name} đã huỷ kết nối với bạn.`,
      url: `/profile/${userId1}`,
      type: 'unmatched',
    });
  }

  async rejectUser(receiverId: number, senderId: number): Promise<void> {
    await this.prisma.connection_queue.deleteMany({
      where: { senderId, receiverId },
    });

    const rejectorProfile = await this.prisma.profile.findUnique({
      where: { userId: receiverId },
      select: { name: true },
    });
    const name = rejectorProfile?.name || 'Người dùng';

    await this.notificationService.create({
      userId: senderId,
      content: `${name} đã từ chối kết nối với bạn.`,
      url: `/profile/${receiverId}`,  
      type: 'rejected',
    });
  }

  async cancelLike(senderId: number, receiverId: number): Promise<void> {
    await this.prisma.connection_queue.deleteMany({
      where: { senderId, receiverId },
    });

    const senderProfile = await this.prisma.profile.findUnique({
      where: { userId: senderId },
      select: { name: true },
    });
    const name = senderProfile?.name || 'Người dùng';

    await this.notificationService.create({
      userId: receiverId,
      content: `${name} đã huỷ thích bạn.`,
      url: `/profile/${senderId}`,
      type: 'cancel_like',
    });
  }

  async getMyMatches(userId: number): Promise<MatchResultDto[]> {
    const connections = await this.prisma.connection.findMany({
      where: {
        OR: [{ userAId: userId }, { userBId: userId }],
      },
    });

    const matchedIds = connections.map((c) =>
      c.userAId === userId ? c.userBId : c.userAId,
    );

    const results = await Promise.all(
      matchedIds.map(async (matchedUserId) => {
        const profile = await this.prisma.profile.findUnique({
          where: { userId: matchedUserId },
        });
        if (!profile) return null;

        const compatibility = await this.computeCompatibility(userId, matchedUserId);
        return { profile, compatibility };
      })
    );

    return results.filter((r) => r !== null) as MatchResultDto[];
  }

  async getIncomingLikes(userId: number): Promise<MatchResultDto[]> {
    const incoming = await this.prisma.connection_queue.findMany({
      where: { receiverId: userId },
    });

    const senderIds = incoming.map((i) => i.senderId);
    return this.getCompatibilityForUsers(userId, senderIds);
  }

  async getSentLikes(userId: number): Promise<MatchResultDto[]> {
    const sent = await this.prisma.connection_queue.findMany({
      where: { senderId: userId },
    });

    const receiverIds = sent.map((i) => i.receiverId);
    return this.getCompatibilityForUsers(userId, receiverIds);
  }

  async getCompatibilityForUsers(
    userId: number,
    candidateIds: number[],
  ): Promise<MatchResultDto[]> {
    const results: MatchResultDto[] = [];
    for (const candidateId of candidateIds) {
      if (candidateId === userId) continue;
      const profile = await this.prisma.profile.findUnique({
        where: { userId: candidateId },
      });
      if (!profile) continue;

      const detail = await this.computeCompatibility(userId, candidateId);
      results.push({ profile, compatibility: detail });
    }
    return results;
  }

  private async computeCompatibility(userIdA: number, userIdB: number) {
    const profileA = await this.prisma.profile.findUnique({
      where: { userId: userIdA },
      include: {
        user: {
          include: {
            personalityTests: {
              orderBy: { created_at: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    const profileB = await this.prisma.profile.findUnique({
      where: { userId: userIdB },
      include: {
        user: {
          include: {
            personalityTests: {
              orderBy: { created_at: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    const hasPersonalityA = !!profileA?.user.personalityTests[0];
    const hasPersonalityB = !!profileB?.user.personalityTests[0];

    const interestScore = this.jaccardSimilarity(
      profileA?.interests ?? [],
      profileB?.interests ?? [],
    );

    const goalScore =
      profileA?.relationship_goals === profileB?.relationship_goals ? 1 : 0;

    let oceanScore: number | null = null;
    let totalScore = 0;
    let personalityDetails: {
      openness: number;
      conscientiousness: number;
      extraversion: number;
      agreeableness: number;
      neuroticism: number;
    } | null = null;

    if (hasPersonalityA && hasPersonalityB) {
      const oceanA = this.extractOcean(profileA).map((x) => x / 100);
      const oceanB = this.extractOcean(profileB).map((x) => x / 100);
      oceanScore = this.cosineSimilarity(oceanA, oceanB);

      personalityDetails = {
        openness: Math.round(oceanB[0] * 100),
        conscientiousness: Math.round(oceanB[1] * 100),
        extraversion: Math.round(oceanB[2] * 100),
        agreeableness: Math.round(oceanB[3] * 100),
        neuroticism: Math.round(oceanB[4] * 100),
      };

      totalScore = (interestScore + goalScore + oceanScore) / 3;
    } else {
      if (hasPersonalityB) {
        const oceanB = this.extractOcean(profileB).map((x) => x / 100);
        personalityDetails = {
          openness: Math.round(oceanB[0] * 100),
          conscientiousness: Math.round(oceanB[1] * 100),
          extraversion: Math.round(oceanB[2] * 100),
          agreeableness: Math.round(oceanB[3] * 100),
          neuroticism: Math.round(oceanB[4] * 100),
        };
      }
      totalScore = (interestScore + goalScore) / 3;
    }

    return {
      interestScore: Math.round(interestScore * 100),
      goalScore: goalScore * 100,
      totalScore: Math.round(totalScore * 100),
      ...(oceanScore !== null && {
        oceanScore: Math.round(oceanScore * 100),
      }),
      ...(personalityDetails && {
        personalityDetails,
      }),
    };
  }

  private extractOcean(profile: any): number[] {
    const p = profile.user.personalityTests[0];
    return [
      p.openness,
      p.conscientiousness,
      p.extraversion,
      p.agreeableness,
      p.neuroticism,
    ];
  }

  private jaccardSimilarity(arr1: string[], arr2: string[]): number {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    const intersection = [...set1].filter((item) => set2.has(item));
    const union = new Set([...set1, ...set2]);
    return union.size === 0 ? 0 : intersection.length / union.size;
  }

  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const magnitudeA = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }

  
async getMyMatchesWithInterests(userId: number): Promise<MatchResultDto[]> {
  const connections = await this.prisma.connection.findMany({
    where: {
      OR: [{ userAId: userId }, { userBId: userId }],
    },
  });

  const matchedIds = connections.map((c) =>
    c.userAId === userId ? c.userBId : c.userAId,
  );

  const results = await Promise.all(
    matchedIds.map(async (matchedUserId) => {
      const profile = await this.prisma.profile.findUnique({
        where: { userId: matchedUserId },
        select: {
          userId: true,
          name: true,
          avt: true,
          interests: true, 
        },
      });

      if (!profile) return null;

      const compatibility = await this.computeCompatibility(userId, matchedUserId);
      return { profile, compatibility };
    })
  );

  return results.filter((r) => r !== null) as MatchResultDto[];
}
}

