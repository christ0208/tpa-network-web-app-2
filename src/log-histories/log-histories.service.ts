import { Injectable } from '@nestjs/common';
import { db } from 'src/common/database/pg/index.init';
import { LogHistoryDto } from './dto/log-history-dto/log-history-dto';

@Injectable()
export class LogHistoriesService {
    async create(dto: LogHistoryDto) {
        return db.logHistories.create(dto);
    }
}
