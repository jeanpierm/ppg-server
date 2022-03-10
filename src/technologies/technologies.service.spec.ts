import { Test, TestingModule } from '@nestjs/testing';
import { TechnologiesService } from './technologies.service';

describe('TechnologiesService', () => {
  let service: TechnologiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TechnologiesService],
    }).compile();

    service = module.get<TechnologiesService>(TechnologiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
