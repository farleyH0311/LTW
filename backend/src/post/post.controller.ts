import {
  CreatePostDto,
  PostDto,
  CreateCommentDto,
  UpdateCommentDto,
  UpdatePostDto,
} from './dto/post.dto';
import { PostsService } from './post.service';
import {
  Controller,
  Post,
  Body,
  Query,
  Get,
  Delete,
  Put,
  Req,
  Param,
  BadRequestException,
  ParseIntPipe,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guard/access-token.guard';
@UseGuards(AccessTokenGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Headers('authorization') authHeader: string,
    @Req() request: Request,
  ) {
    const { userId, content, media_urls } = createPostDto;

    if (!userId) {
      throw new BadRequestException('userId is required');
    }
    return this.postService.createPost(userId, { content, media_urls });
  }
  @Get()
  async getAll(@Req() req): Promise<PostDto[]> {
    const currentUserId = req.user.id;
    return this.postService.getAllPosts(currentUserId);
  }
  @Post(':postId/like')
  async toggleLike(@Body() body: any, @Param('postId') postId: string) {
    console.log('Request body:', body);

    const { userId } = body;

    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    const userIdNumber = Number(userId);
    if (isNaN(userIdNumber)) {
      throw new BadRequestException('Invalid userId');
    }

    const postIdNumber = Number(postId);
    if (isNaN(postIdNumber)) {
      throw new BadRequestException('Invalid postId');
    }

    return this.postService.toggleLike(userIdNumber, postIdNumber);
  }
  @Post(':postId/comments')
  async createComment(
    @Param('postId') postId: number,
    @Body() body: CreateCommentDto,
  ) {
    const { userId } = body;
    const userIdNumber = Number(userId);

    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    if (!postId || isNaN(postId)) {
      throw new BadRequestException('postId must be a valid number');
    }

    return this.postService.createComment(userIdNumber, {
      ...body,
      postId,
    });
  }
  // Xóa cmt
  @Delete(':userId/:commentId/comments/')
  async deleteComment(
    @Param('userId') userId: number,
    @Param('commentId') commentId: number,
  ) {
    return this.postService.deleteComment(userId, commentId);
  }

  @Get(':postId/comments')
  async getComments(@Param('postId', ParseIntPipe) postId: number) {
    return this.postService.getCommentsByPost(postId);
  }
  @Put(':userId/:commentId/comments')
  async updateComments(
    @Param('userId') userId: number,
    @Param('commentId') commentId: number,
    @Body() body: UpdateCommentDto,
  ) {
    body.id = Number(commentId);

    return this.postService.updateComment(
      Number(userId),
      Number(commentId),
      body,
    );
  }
  // sửa bài viết
  @Put(':userId/:postId')
  async updatePost(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: UpdatePostDto,
  ) {
    return this.postService.updatePost(userId, postId, body);
  }
  // xóa bài
  @Delete(':userId/:postId')
  async deletePost(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.postService.deletePost(userId, postId);
  }
  @Get('users/:id/images')
  async getAllUserImages(@Param('id') userId: string) {
    return this.postService.getAllUserImages(Number(userId));
  }

  @Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPostById(id);
  }

}
