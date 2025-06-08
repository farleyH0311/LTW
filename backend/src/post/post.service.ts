import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreatePostDto,
  PostDto,
  CreateCommentDto,
  UpdateCommentDto,
  UpdatePostDto,
} from './dto/post.dto';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  // Tạo bài viết mới
  async createPost(userId: number, body: CreatePostDto) {
    const createdPost = await this.prisma.posts.create({
      data: {
        userId,
        content: body.content,
        media_urls: body.media_urls,
      },
    });

    // Gửi thông báo đến tất cả user trừ người đăng
    const usersToNotify = await this.prisma.users.findMany({
      where: {
        id: { not: userId },
      },
    });

    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { name: true },
    });
    const name = profile?.name || 'Người dùng';

    await Promise.all(
      usersToNotify.map((user) =>
        this.notificationService.create({
          userId: user.id,
          content: `${name} vừa đăng một bài viết mới.`,
          url: '/feed',
          type: 'new_post',
        })
      )
    );

    return createdPost;
  }

  // Lấy tất cả bài viết
  async getAllPosts(currentUserId: number): Promise<PostDto[]> {
    const posts = await this.prisma.posts.findMany({
      orderBy: {
        created_at: 'desc',
      },
      include: {
        likes: {
          where: {
            userId: currentUserId,
          },
          select: {
            userId: true,
          },
        },
      },
    });

    return posts.map((post) => ({
      id: post.id,
      userId: post.userId,
      content: post.content,
      media_urls: post.media_urls,
      createdAt: post.created_at,
      likesCount: post.likes_count,
      comments_count: post.comments_count,
      isLike: post.likes.length > 0,
    }));
  }

    //Like
  async toggleLike(userId: number, postId: number) {
    const existingLike = await this.prisma.post_likes.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      await this.prisma.post_likes.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });

      await this.prisma.posts.update({
        where: { id: postId },
        data: {
          likes_count: {
            decrement: 1,
          },
        },
      });

      return { message: '0' };
    } else {
      await this.prisma.post_likes.create({
        data: {
          userId,
          postId,
        },
      });

      await this.prisma.posts.update({
        where: { id: postId },
        data: {
          likes_count: {
            increment: 1,
          },
        },
      });

      const post = await this.prisma.posts.findUnique({
        where: { id: postId },
        select: { userId: true },
      });

      const likerProfile = await this.prisma.profile.findUnique({
        where: { userId },
        select: { name: true },
      });

      const name = likerProfile?.name || 'Người dùng';

      if (post && post.userId !== userId) {
        await this.notificationService.create({
          userId: post.userId,
          content: `${name} đã thích bài viết của bạn.`,
          url: `/posts/${postId}`,
          type: 'like_post',
        });
      }

      return { message: '1' };
    }
  }

  async createComment(userId: number, body: CreateCommentDto) {
    const postId = Number(body.postId);

    if (isNaN(postId)) {
      throw new BadRequestException('postId must be a valid number');
    }

    if (!body.content?.trim()) {
      throw new BadRequestException('Nội dung bình luận không được để trống');
    }

    const comment = await this.prisma.comments.create({
      data: {
        userId,
        postId,
        content: body.content,
        parentCommentId: body.parentCommentId || null,
      },
      include: {
        user: true,
      },
    });

    await this.prisma.posts.update({
      where: { id: postId },
      data: {
        comments_count: {
          increment: 1,
        },
      },
    });

    const post = await this.prisma.posts.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    const commenter = await this.prisma.profile.findUnique({
      where: { userId },
      select: { name: true },
    });

    const name = commenter?.name || 'Người dùng';

    if (post && post.userId !== userId) {
      await this.notificationService.create({
        userId: post.userId,
        content: `${name} đã bình luận bài viết của bạn.`,
        url: `/posts/${postId}`,
        type: 'comment_post',
      });
    }

    return comment;
  }

  async getCommentsByPost(postId: number) {
    return await this.prisma.comments.findMany({
      where: {
        postId,
      },
      select: {
        id: true,
        content: true,
        parentCommentId: true,
        created_at: true,
        userId: true,
        user: {
          select: {
            profile: {
              select: {
                name: true,
                avt: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'asc',
      },
    });
  }

  async deleteComment(userId: number, commentId: number) {
    const commentIdNumber = Number(commentId);
    const userIdNumber = Number(userId);

    const comment = await this.prisma.comments.findUnique({
      where: { id: commentIdNumber },
      include: {
        post: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('Không tìm thấy bình luận');
    }

    if (comment.userId !== userIdNumber) {
      throw new ForbiddenException('Bạn không có quyền xóa bình luận này');
    }

    await this.prisma.comments.delete({
      where: { id: commentIdNumber },
    });

    await this.prisma.posts.update({
      where: { id: comment.postId },
      data: {
        comments_count: {
          decrement: 1,
        },
      },
    });

    return { message: 'Đã xóa bình luận thành công' };
  }
  // Sửa bài viết
  async updatePost(userId: number, postId: number, body: UpdatePostDto) {
    const postIdNumber = Number(postId);
    if (isNaN(postIdNumber)) {
      throw new BadRequestException('ID bài viết không hợp lệ');
    }

    const post = await this.prisma.posts.findUnique({
      where: { id: postIdNumber },
    });

    if (!post) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa bài viết này');
    }

    const updatedPost = await this.prisma.posts.update({
      where: { id: postIdNumber },
      data: {
        content: body.content,
        media_urls: body.media_urls,
        updated_at: new Date(),
      },
    });

    return {
      message: 'Đã cập nhật bài viết thành công',
      post: updatedPost,
    };
  }
  // xóa bài
  async deletePost(userId: number, postId: number) {
    const post = await this.prisma.posts.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa bài viết này');
    }

    await this.prisma.comments.deleteMany({
      where: { postId: postId },
    });

    await this.prisma.post_likes.deleteMany({
      where: { postId: postId },
    });

    await this.prisma.posts.delete({
      where: { id: postId },
    });

    return {
      message: 'Đã xóa bài viết cùng tất cả bình luận và lượt thích liên quan',
    };
  }
  async getAllUserImages(userId: number): Promise<string[]> {
    const posts = await this.prisma.posts.findMany({
      where: {
        userId: userId,
      },
      select: {
        media_urls: true,
      },
    });

    const images: string[] = [];

    posts.forEach((post) => {
      if (post.media_urls && post.media_urls.length > 0) {
        images.push(...post.media_urls);
      }
    });

    return images;
  }

  async updateComment(
  userId: number,
  commentId: number,
  body: UpdateCommentDto,
) {
  const comment = await this.prisma.comments.findUnique({
    where: { id: commentId },
    include: { post: true },
  });

  if (!comment) {
    throw new NotFoundException('Không tìm thấy bình luận');
  }

  if (comment.userId !== userId) {
    throw new ForbiddenException('Bạn không có quyền chỉnh sửa bình luận này');
  }

  const updatedComment = await this.prisma.comments.update({
    where: { id: commentId },
    data: {
      content: body.content,
      updated_at: new Date(),
    },
  });

  return {
    message: 'Đã cập nhật bình luận thành công',
    comment: updatedComment,
  };
}
}
