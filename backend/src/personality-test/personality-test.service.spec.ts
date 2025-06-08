import { Test, TestingModule } from '@nestjs/testing';
import { PersonalityTestService } from './personality-test.service';

describe('PersonalityTestService', () => {
  let service: PersonalityTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonalityTestService],
    }).compile();

    service = module.get<PersonalityTestService>(PersonalityTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
