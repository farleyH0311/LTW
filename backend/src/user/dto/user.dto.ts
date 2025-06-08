import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsArray,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  account_name: string;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  age: number;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsString()
  @IsOptional()
  about_me?: string;

  @IsString()
  @IsOptional()
  occupation?: string;

  @IsString()
  @IsOptional()
  education?: string;

  @IsInt()
  @IsOptional()
  height?: number;

  @IsArray()
  @IsOptional()
  interests?: string[];

  @IsString()
  @IsOptional()
  relationship_goals?: string;

  @IsString()
  @IsOptional()
  avt?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  account_name?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  age?: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsString()
  @IsOptional()
  about_me?: string;

  @IsString()
  @IsOptional()
  occupation?: string;

  @IsString()
  @IsOptional()
  education?: string;

  @IsInt()
  @IsOptional()
  height?: number;

  @IsArray()
  @IsOptional()
  interests?: string[];

  @IsString()
  @IsOptional()
  relationship_goals?: string;

  @IsString()
  @IsOptional()
  avt?: string;
}
