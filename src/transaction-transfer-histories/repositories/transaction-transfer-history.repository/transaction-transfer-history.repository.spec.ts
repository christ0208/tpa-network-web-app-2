import { TransactionTransferHistoryRepository } from './transaction-transfer-history.repository';

describe('TransactionTransferHistoryRepository', () => {
  it('should be defined', () => {
    expect(new TransactionTransferHistoryRepository()).toBeDefined();
  });
});
