import { Test, TestingModule } from '@nestjs/testing';
import { DownloadPreferencesService } from './download-preferences.service';

describe('DownloadPreferencesService', () => {
  let service: DownloadPreferencesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DownloadPreferencesService],
    }).compile();

    service = module.get<DownloadPreferencesService>(DownloadPreferencesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
