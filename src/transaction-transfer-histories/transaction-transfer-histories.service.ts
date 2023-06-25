import { Injectable } from '@nestjs/common';
import { db } from 'src/common/database/pg/index.init';
import { TransactionTransferHistoryDto } from './dto/transaction-transfer-history-dto/transaction-transfer-history-dto';

@Injectable()
export class TransactionTransferHistoriesService {
    async create(dto: TransactionTransferHistoryDto) {
        return db.transactionTransferHistories.create(dto);
    }
}
