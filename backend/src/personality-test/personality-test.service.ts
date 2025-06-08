import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePersonalityTestDto } from './dto/personality-test.dto';

@Injectable()
export class PersonalityTestService {
  constructor(private prisma: PrismaService) {}

  async createTestResult(userId: number, data: CreatePersonalityTestDto) {
    return await this.prisma.personality_test.create({
      data: {
        userId,
        openness: data.openness,
        conscientiousness: data.conscientiousness,
        extraversion: data.extraversion,
        agreeableness: data.agreeableness,
        neuroticism: data.neuroticism,
      },
    });
  }

  async getTestsByUser(userId: number) {
    return await this.prisma.personality_test.findMany({
      where: { userId },
      orderBy: { created_at: 'desc' },
    });
  }

  //   // Lấy bài test theo id
  //   async getTestById(testId: number) {
  //     return await this.prisma.personality_test.findUnique({
  //       where: { id: testId },
  //     });
  //   }
  async getLatestTestByUser(userId: number) {
    return await this.prisma.personality_test.findFirst({
      where: { userId },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
