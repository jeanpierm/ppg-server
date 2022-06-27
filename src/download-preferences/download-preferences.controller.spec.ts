import { Test, TestingModule } from '@nestjs/testing';
import { DownloadPreferencesController } from './download-preferences.controller';

describe('DownloadPreferencesController', () => {
  let controller: DownloadPreferencesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DownloadPreferencesController],
    }).compile();

    controller = module.get<DownloadPreferencesController>(DownloadPreferencesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
