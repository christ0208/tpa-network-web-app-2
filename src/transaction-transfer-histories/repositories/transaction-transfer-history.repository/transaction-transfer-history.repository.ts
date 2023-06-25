import { IDatabase, IMain } from "pg-promise";
import { TransactionTransferHistory } from "src/transaction-transfer-histories/interfaces/transaction-transfer-history/transaction-transfer-history.interface";

export class TransactionTransferHistoryRepository {
    /**
     * @param db
     * Automated database connection context/interface.
     *
     * If you ever need to access other repositories from this one,
     * you will have to replace type 'IDatabase<any>' with 'any'.
     *
     * @param pgp
     * Library's root, if ever needed, like to access 'helpers'
     * or other namespaces available from the root.
     */
     constructor(private db: IDatabase<any>, private pgp: IMain) {}

     /**
      * Create new transaction transfer history for logging.
      * 
      * @param data 
      * @returns LogHistory
      */
     async create(data: {
        sourceAccountNumber: string;
        sourceEmail: string;
        destAccountNumber: string;
        destEmail: string;
        balance: number;
     }): Promise<TransactionTransferHistory> {
         const { sourceAccountNumber, sourceEmail, destAccountNumber, destEmail, balance } = data;
         
         const query: string = `INSERT INTO transaction_transfer_histories (source_account_number, source_email, dest_account_number, dest_email, balance) VALUES ('${sourceAccountNumber}', '${sourceEmail}', '${destAccountNumber}', '${destEmail}', '${balance}') RETURNING id, source_account_number, source_email, dest_account_number, dest_email, balance, created_at`;
         const result = await this.db.one(query);
 
         return result;
     }
}
