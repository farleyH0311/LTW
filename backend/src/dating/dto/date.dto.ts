import { IsString, IsDateString, IsNumber, IsIn } from 'class-validator';
import { IsInt, Min, Max } from 'class-validator';

export class CreateDateDto {
  @IsString()
  title: string;

  @IsDateString()
  time: string;

  @IsString()
  location: string;

  @IsNumber()
  senderId: number;

  @IsNumber()
  receiverId: number;

  @IsIn(['pending', 'confirmed', 'rejected'])
  status: 'pending' | 'confirmed' | 'rejected';
}

export class UpdateDateStatusDto {
  @IsIn(['pending', 'confirmed', 'rejected', 'accepted', 'cancelled'])
  status: 'pending' | 'confirmed' | 'rejected' | 'accepted' | 'cancelled';
}

export class RateDateDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsInt()
  userId: number;
}