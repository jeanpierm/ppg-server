import { Test, TestingModule } from '@nestjs/testing';
import { TechTypesController } from './tech-types.controller';
import { TechTypesService } from './tech-types.service';

describe('TechTypesController', () => {
  let controller: TechTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechTypesController],
      providers: [TechTypesService],
    }).compile();

    controller = module.get<TechTypesController>(TechTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
