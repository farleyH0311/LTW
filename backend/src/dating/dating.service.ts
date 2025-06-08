import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDateDto } from './dto/date.dto';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class DatingService {
  constructor(
    private readonly prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async createDate(data: CreateDateDto) {
    const newDate = await this.prisma.dating_plan.create({
      data: {
        title: data.title,
        time: new Date(data.time),
        location: data.location,
        status: data.status,
        senderId: data.senderId,
        receiverId: data.receiverId,
      },
    });

    // Lấy tên người gửi
    const senderProfile = await this.prisma.profile.findUnique({
      where: { userId: data.senderId },
      select: { name: true },
    });
    const name = senderProfile?.name || 'Người dùng';

    // Gửi thông báo cho người được mời
    await this.notificationService.create({
      userId: data.receiverId,
      content: `${name} đã gửi cho bạn một lời mời hẹn hò.`,
      url: '/dating',
      type: 'date_invitation',
    });

    return newDate;
  }

  async getMyDates(userId: number) {
    return this.prisma.dating_plan.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: { id: true, profile: true },
        },
        receiver: {
          select: { id: true, profile: true },
        },
      },
    });
  }

  async updateDateStatus(dateId: number, status: string, updatedByUserId: number) {
    const date = await this.prisma.dating_plan.update({
      where: { id: dateId },
      data: { status },
    });

    const otherUserId = updatedByUserId === date.senderId
      ? date.receiverId
      : date.senderId;

    const updaterProfile = await this.prisma.profile.findUnique({
      where: { userId: updatedByUserId },
      select: { name: true },
    });

    const name = updaterProfile?.name || 'Người dùng';

    let content = '';
    if (status === 'cancelled') {
      content = `${name} đã huỷ cuộc hẹn.`;
    } else if (status === 'accepted') {
      content = `${name} đã chấp nhận lời mời hẹn hò.`;
    }

    if (content) {
      await this.notificationService.create({
        userId: otherUserId,
        content,
        url: '/dating',
        type: 'date_status',
      });
    }

    return date;
  }

async rateDate(dateId: number, userId: number, rating: number) {
  const date = await this.prisma.dating_plan.findUnique({
    where: { id: dateId },
  });

  if (!date) {
    throw new Error("Date not found");
  }

  if (userId !== date.senderId && userId !== date.receiverId) {
    throw new Error("User is not part of this date");
  }
  const dataToUpdate =
    userId === date.senderId
      ? { senderRating: rating }
      : { receiverRating: rating };

  const updated = await this.prisma.dating_plan.update({
    where: { id: dateId },
    data: dataToUpdate,
  });
  const raterProfile = await this.prisma.profile.findUnique({
    where: { userId },
    select: { name: true },
  });

  const name = raterProfile?.name || 'Người dùng';
  const targetUserId =
    userId === date.senderId ? date.receiverId : date.senderId;

  await this.notificationService.create({
    userId: targetUserId,
    content: `${name} đã đánh giá buổi hẹn với bạn.`,
    url: '/dating',
    type: 'rate_date',
  });

  return updated;
}
}
