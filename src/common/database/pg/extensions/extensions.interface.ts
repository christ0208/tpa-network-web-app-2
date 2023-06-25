import { AccountsRepository } from "src/accounts/repositories/accounts.repository/accounts.repository";
import { AccessTokenRepository } from "src/auth/repositories/access-token.repository/access-token.repository";
import { LogHistoryRepository } from "src/log-histories/repositories/log-history.repository/log-history.repository";
import { TransactionTransferHistoryRepository } from "src/transaction-transfer-histories/repositories/transaction-transfer-history.repository/transaction-transfer-history.repository";
import { UserUpdateHistoryRepository } from "src/user-update-histories/repositories/user-update-histories.repository/user-update-history.repository";

export interface IExtensions {
    accounts: AccountsRepository;
    accessTokens: AccessTokenRepository;
    logHistories: LogHistoryRepository;
    userUpdateHistories: UserUpdateHistoryRepository;
    transactionTransferHistories: TransactionTransferHistoryRepository;
}