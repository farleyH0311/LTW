import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateNotificationDto {
  @IsInt()
  userId: number;

  @IsString()
  content: string;

  @IsOptional()
  @IsUrl()
  url?: string;
  type?: string;
}
