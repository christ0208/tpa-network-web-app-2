import { IDatabase, IMain } from "pg-promise";
import { Account } from "src/accounts/interfaces/account/account.interface";

export class AccountsRepository {

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
     * Get all account data.
     * 
     * @param options
     */
    all(options : {
        includeDeleted: boolean
    } = { 
        includeDeleted: false 
    }): Promise<Account[]> {
        const { includeDeleted } = options;
        const query: string = (includeDeleted) ? `SELECT * FROM accounts` : `SELECT * FROM accounts WHERE deleted_at is null`; 

        return this.db.any(query);
    }

    /**
     * Get account data based on given account data.
     * Possible parametered account data:
     * - Account ID
     * 
     * @param data 
     * @returns Account
     */
    get(data: {
        accountId?: number,
        email?: string,
        accountNumber?: string
    } = {
        accountId: null,
        email: null,
        accountNumber: null
    }): Promise<Account> {
        const { accountId, email, accountNumber } = data;

        const isConditionActivated: {
            accountIdCondition: boolean;
            emailCondition: boolean;
            accountNumberCondition: boolean;
        } = {
            accountIdCondition: false,
            emailCondition: false,
            accountNumberCondition: false
        }

        if (accountId === null && accountId === undefined && email === null && email === undefined && accountNumber === null && accountNumber === undefined) return null;
        
        if (accountId !== null && accountId !== undefined) isConditionActivated.accountIdCondition = true;
        if (email !== null && email !== undefined) isConditionActivated.emailCondition = true;
        if (accountNumber !== null && accountNumber !== undefined) isConditionActivated.accountNumberCondition = true;

        let counter: number = 0;
        let whereConditionString: string = "";
        for (const [key, value] of Object.entries(isConditionActivated)) {
            counter += (value) ? 1 : 0;
            
            if (value && counter > 1) whereConditionString = whereConditionString.concat(' AND ');
            
            if (value && key === 'accountIdCondition') whereConditionString = whereConditionString.concat(`id=${accountId}`);
            if (value && key === 'emailCondition') whereConditionString = whereConditionString.concat(`email='${email}'`);
            if (value && key === 'accountNumberCondition') whereConditionString = whereConditionString.concat(`account_number='${accountNumber}'`);
        }

        const query: string = `SELECT id, email, account_number, balance FROM accounts WHERE ${whereConditionString}`;
        return this.db.oneOrNone(query);
    }

    /**
     * Get account data based on given e-mail address, account number, and password.
     * 
     * @param credential 
     * @returns 
     */
    findByCredential(credential: {
        email: string,
        accountNumber: string,
        password: string
    }): Promise<Account> {
        const { email, accountNumber, password } = credential;
        const query: string = `SELECT id, email, account_number FROM accounts WHERE email='${email}' AND account_number='${accountNumber}' AND password='${password}'`;
        console.log(query);

        return this.db.oneOrNone(query);
    }

    /**
     * Create new account based on given account data.
     * 
     * @param data 
     * @returns Account
     */
    create(data: {
        email: string,
        accountNumber: string,
        password: string
    }): Promise<Account> {
        const { email, accountNumber, password } = data;
        const query: string = `INSERT INTO accounts (email, account_number, password, balance) VALUES ('${email}', '${accountNumber}', '${password}', 200000) RETURNING id, email, account_number, balance`;

        return this.db.one(query);
    }

    /**
     * Update account based on given account data.
     * 
     * @param selectedAccount 
     * @param data 
     * @returns Account
     */
    update(selectedAccount: Account, data: {
        password?: string;
        additionalBalance?: number;
        substractionBalance?: number;
    } = {
        password: null,
        additionalBalance: null,
        substractionBalance: null,
    }): Promise<Account> {
        const { password, additionalBalance, substractionBalance } = data;

        const isConditionActivated: {
            passwordCondition: boolean;
        } = {
            passwordCondition: false
        }

        let query: string = "";
        if (additionalBalance !== null && additionalBalance !== undefined) {
            query = `UPDATE accounts SET balance=${selectedAccount.balance} + ${additionalBalance}, updated_at=CURRENT_TIMESTAMP WHERE id=${selectedAccount.id} RETURNING id, account_number, email, balance`;
        } else if (substractionBalance !== null && substractionBalance !== undefined) {
            query = `UPDATE accounts SET balance=${selectedAccount.balance} - ${substractionBalance}, updated_at=CURRENT_TIMESTAMP WHERE id=${selectedAccount.id} RETURNING id, account_number, email, balance`;
        } else {
            if (password !== null && password !== undefined) isConditionActivated.passwordCondition = true;

            let counter: number = 0;
            let setConditionString: string = "";
            for (const [key, value] of Object.entries(isConditionActivated)) {
                counter += (value) ? 1 : 0;
                
                if (value && counter > 1) setConditionString = setConditionString.concat(',');
                
                if (value && key === 'passwordCondition') setConditionString = setConditionString.concat(`password='${password}'`);
            }
            
            query = `UPDATE accounts SET ${setConditionString}, updated_at=CURRENT_TIMESTAMP WHERE id=${selectedAccount.id} RETURNING id, account_number, email, balance`;
        }

        return this.db.one(query);
    }
}
