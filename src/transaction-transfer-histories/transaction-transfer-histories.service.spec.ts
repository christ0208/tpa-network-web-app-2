import { Test, TestingModule } from '@nestjs/testing';
import { TransactionTransferHistoriesService } from './transaction-transfer-histories.service';

describe('TransactionTransferHistoriesService', () => {
  let service: TransactionTransferHistoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionTransferHistoriesService],
    }).compile();

    service = module.get<TransactionTransferHistoriesService>(TransactionTransferHistoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
