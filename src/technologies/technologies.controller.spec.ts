import { Test, TestingModule } from '@nestjs/testing';
import { TechnologiesController } from './technologies.controller';
import { TechnologiesService } from './technologies.service';

describe('TechnologiesController', () => {
  let controller: TechnologiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechnologiesController],
      providers: [TechnologiesService],
    }).compile();

    controller = module.get<TechnologiesController>(TechnologiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
