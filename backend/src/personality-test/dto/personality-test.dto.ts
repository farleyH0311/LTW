import { IsNumber, Min, Max } from 'class-validator';

export class CreatePersonalityTestDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  openness: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  conscientiousness: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  extraversion: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  agreeableness: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  neuroticism: number;
}
