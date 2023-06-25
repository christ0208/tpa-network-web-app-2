import * as pgPromise from "pg-promise";
import { IDatabase, IInitOptions, IMain } from "pg-promise";
import { AccountsRepository } from "src/accounts/repositories/accounts.repository/accounts.repository";
import { IExtensions } from "./extensions/extensions.interface";

// Import .env variable in advance before creating connection instance to PostgreSQL
import * as dotenv from "dotenv";
import { AccessTokenRepository } from "src/auth/repositories/access-token.repository/access-token.repository";
import { LogHistoryRepository } from "src/log-histories/repositories/log-history.repository/log-history.repository";
import { UserUpdateHistoryRepository } from "src/user-update-histories/repositories/user-update-histories.repository/user-update-history.repository";
import { TransactionTransferHistoryRepository } from "src/transaction-transfer-histories/repositories/transaction-transfer-history.repository/transaction-transfer-history.repository";
dotenv.config();

type ExtendedProtocol = IDatabase<IExtensions> & IExtensions;

const initOptions: IInitOptions<IExtensions> = {
    extend(obj: ExtendedProtocol, dc: any) {
        obj.accounts = new AccountsRepository(obj, pgp);
        obj.accessTokens = new AccessTokenRepository(obj, pgp);
        obj.logHistories = new LogHistoryRepository(obj, pgp);
        obj.userUpdateHistories = new UserUpdateHistoryRepository(obj, pgp);
        obj.transactionTransferHistories = new TransactionTransferHistoryRepository(obj, pgp);
    }
};

const pgp: IMain = pgPromise(initOptions);
const db: ExtendedProtocol = pgp(`${process.env.DB_APP}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`);

export {db, pgp};