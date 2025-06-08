import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsInt,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsArray()
  @IsOptional()
  media_urls?: string[];

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  userId?: number;
}
export class PostDto {
  id: number;
  userId: number;
  content: string;
  media_urls: string[];
  createdAt: Date;
  likesCount: number;
  comments_count: number;
  isLike: boolean;
}
export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  postId: number;

  @IsOptional()
  @Transform(({ value }) => (value !== null ? parseInt(value) : undefined))
  @IsInt()
  parentCommentId?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  userId?: number;
}
export class UpdateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  // @IsNotEmpty()
  // @Transform(({ value }) => parseInt(value))
  // @IsInt()
  // postId: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  userId?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  id: number;
}
export class UpdatePostDto {
  @IsOptional()
  @IsString()
  content?: string;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  userId?: number;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  media_urls?: string[];
}
