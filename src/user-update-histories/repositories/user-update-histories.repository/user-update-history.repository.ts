import { IDatabase, IMain } from "pg-promise";
import { UserUpdateHistory } from "src/user-update-histories/interfaces/user-update-history/user-update-history.interface";

export class UserUpdateHistoryRepository {
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
      * Create new user update history for logging.
      * 
      * @param data 
      * @returns UserUpdateHistory
      */
     async create(data: {
        accountNumber: string;
        email: string;
        action: string;
     }): Promise<UserUpdateHistory> {
        const { accountNumber, email, action } = data;
        
        const query: string = `INSERT INTO user_update_histories (account_number, email, action) VALUES ('${accountNumber}', '${email}', '${action}') RETURNING id, account_number, email, action, created_at`;
        const result = await this.db.one(query);

        return result;
     }
}
