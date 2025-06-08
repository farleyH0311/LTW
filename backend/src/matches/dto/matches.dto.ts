export class CompatibilityRequestDto {
  userId: number;
  candidateIds: number[];
}

export class CompatibilityScoreDto {
  interestScore: number;
  oceanScore?: number;
  goalScore: number;
  totalScore: number;
}

export class MatchResultDto {
  profile: any;
  compatibility: CompatibilityScoreDto;
}
