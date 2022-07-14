import { Test, TestingModule } from '@nestjs/testing';
import { TechTypesService } from './tech-types.service';

describe('TechTypesService', () => {
  let service: TechTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TechTypesService],
    }).compile();

    service = module.get<TechTypesService>(TechTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
