import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { profile, users } from '@prisma/client';
import { hash, compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createProfile(userId: number, body: CreateUserDto): Promise<profile> {
    const userExists = await this.prismaService.users.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new HttpException('Người dùng không tồn tại', HttpStatus.NOT_FOUND);
    }

    const createdProfile = await this.prismaService.profile.create({
      data: { userId, ...body },
    });

    return createdProfile;
  }

  async getProfile(userId: number): Promise<profile> {
    const profile = await this.prismaService.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new HttpException('Profile không tồn tại', HttpStatus.NOT_FOUND);
    }

    return profile;
  }
  async getProfileByIdProfile(id: number): Promise<any> {
    const profile = await this.prismaService.profile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new HttpException('Profile không tồn tại', HttpStatus.NOT_FOUND);
    }

    const latestTest = await this.prismaService.personality_test.findFirst({
      where: { userId: profile.userId },
      orderBy: { created_at: 'desc' },
    });

    return {
      ...profile,
      personalityTest: latestTest || null,
    };
  }

  async updateProfile(userId: number, data: UpdateUserDto): Promise<profile> {
    const profile = await this.prismaService.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new HttpException('Profile không tồn tại', HttpStatus.NOT_FOUND);
    }

    return await this.prismaService.profile.update({
      where: { userId },
      data,
    });
  }
  async getAllUsers(): Promise<any[]> {
    return this.prismaService.profile.findMany({
      include: {
        user: {
          select: {
            is_online: true,
            last_online_at: true,
          },
        },
      },
    });
  }
  async deleteUser(id: number) {
    const user = await this.prismaService.users.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const userPosts = await this.prismaService.posts.findMany({
      where: { userId: id },
      select: { id: true },
    });

    const postIds = userPosts.map((p) => p.id);

    if (postIds.length > 0) {
      await this.prismaService.post_likes.deleteMany({
        where: { postId: { in: postIds } },
      });

      await this.prismaService.comments.deleteMany({
        where: { postId: { in: postIds } },
      });

      await this.prismaService.posts.deleteMany({
        where: { id: { in: postIds } },
      });
    }

    await this.prismaService.post_likes.deleteMany({
      where: { userId: id },
    });

    await this.prismaService.comments.deleteMany({
      where: { userId: id },
    });
    await this.prismaService.otp.deleteMany({
      where: { userId: id },
    });
    await this.prismaService.profile.deleteMany({
      where: { userId: id },
    });
    await this.prismaService.personality_test.deleteMany({
      where: { userId: id },
    });
    return await this.prismaService.users.delete({ where: { id } });
  }
  async getUserIdByProfileId(profileId: number): Promise<{ userId: number }> {
    const profile = await this.prismaService.profile.findUnique({
      where: { id: profileId },
      select: { userId: true },
    });

    if (!profile) {
      throw new NotFoundException(`Profile with ID ${profileId} not found`);
    }

    return { userId: profile.userId };
  }
  async updateOnlineStatus(userId: number, isOnline: boolean) {
    await this.prismaService.users.update({
      where: { id: userId },
      data: {
        is_online: isOnline,
        last_online_at: isOnline ? null : new Date(),
      },
    });
  }
}
