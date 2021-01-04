import { Test, TestingModule } from '@nestjs/testing';
import { KeyPointsService } from './key-points.service';

describe('KeyPointsService', () => {
  let service: KeyPointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeyPointsService],
    }).compile();

    service = module.get<KeyPointsService>(KeyPointsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
