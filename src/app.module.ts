import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountsModule } from './accounts/accounts.module';
import { AuthModule } from './auth/auth.module';
import { LogHistoriesService } from './log-histories/log-histories.service';
import { TransactionTransferHistoriesService } from './transaction-transfer-histories/transaction-transfer-histories.service';
import { UserUpdateHistoriesService } from './user-update-histories/user-update-histories.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AccountsModule, AuthModule],
  controllers: [],
  providers: [LogHistoriesService, TransactionTransferHistoriesService, UserUpdateHistoriesService],
})
export class AppModule {}
