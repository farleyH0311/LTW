import { Test, TestingModule } from '@nestjs/testing';
import { PersonalityTestController } from './personality-test.controller';

describe('PersonalityTestController', () => {
  let controller: PersonalityTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonalityTestController],
    }).compile();

    controller = module.get<PersonalityTestController>(PersonalityTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
