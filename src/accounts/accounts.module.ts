import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { AuthService } from 'src/auth/auth.service';
import { LogHistoriesService } from 'src/log-histories/log-histories.service';
import { UserUpdateHistoriesService } from 'src/user-update-histories/user-update-histories.service';
import { TransactionTransferHistoriesService } from 'src/transaction-transfer-histories/transaction-transfer-histories.service';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, AuthService, LogHistoriesService, UserUpdateHistoriesService, TransactionTransferHistoriesService]
})
export class AccountsModule {}
