import { Test, TestingModule } from '@nestjs/testing';
import { KeyPointsController } from './key-points.controller';

describe('KeyPointsController', () => {
  let controller: KeyPointsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeyPointsController],
    }).compile();

    controller = module.get<KeyPointsController>(KeyPointsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
