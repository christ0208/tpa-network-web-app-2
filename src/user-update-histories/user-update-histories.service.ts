import { Injectable } from '@nestjs/common';
import { db } from 'src/common/database/pg/index.init';
import { UserUpdateHistoryDto } from './dto/user-update-history-dto/user-update-history-dto';

@Injectable()
export class UserUpdateHistoriesService {
    async create(dto: UserUpdateHistoryDto) {
        return db.userUpdateHistories.create(dto);
    }
}
