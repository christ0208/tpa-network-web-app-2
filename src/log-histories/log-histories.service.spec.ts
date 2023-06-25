import { Test, TestingModule } from '@nestjs/testing';
import { LogHistoriesService } from './log-histories.service';

describe('LogHistoriesService', () => {
  let service: LogHistoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogHistoriesService],
    }).compile();

    service = module.get<LogHistoriesService>(LogHistoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
