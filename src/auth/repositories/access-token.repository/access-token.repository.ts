import { randomBytes } from "crypto";
import { IDatabase, IMain } from "pg-promise";
import { AccessToken } from "src/auth/interfaces/access-token/access-token.interface";

export class AccessTokenRepository {

    private tokenValidityInterval: string;

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
    constructor(private db: IDatabase<any>, private pgp: IMain) {
        this.tokenValidityInterval = '15 minutes';
    }

    /**
     * Get specific access token based on account ID and/or access token.
     * 
     * @param data 
     * @returns AccessToken
     */
    async get(data: {
        accountId?: number;
        accessToken?: string;
    } = {
        accountId: null,
        accessToken: null
    }): Promise<AccessToken> {
        const { accountId, accessToken } = data;
        const isConditionActivated: {
            accountIdCondition: boolean;
            accessTokenCondition: boolean;
        } = {
            accountIdCondition: false,
            accessTokenCondition: false
        }
        
        if (accountId === null && accountId === undefined && accessToken === null && accessToken === undefined) return null;

        if (accountId !== null && accountId !== undefined) isConditionActivated.accountIdCondition = true;
        if (accessToken !== null && accessToken !== undefined) isConditionActivated.accessTokenCondition = true;

        let counter: number = 0;
        let whereConditionString: string = "";
        for (const [key, value] of Object.entries(isConditionActivated)) {
            counter += (value) ? 1 : 0;
            
            if (value && counter > 1) whereConditionString = whereConditionString.concat(' AND ');
            
            if (value && key === 'accountIdCondition') whereConditionString = whereConditionString.concat(`id=${accountId}`);
            if (value && key === 'accessTokenCondition') whereConditionString = whereConditionString.concat(`access_token='${accessToken}'`);
        }
        
        const query: string = `SELECT account_id, access_token, valid_until, EXTRACT(EPOCH FROM (valid_until - CURRENT_TIMESTAMP)) AS valid_difference FROM access_tokens WHERE ${whereConditionString}`;
        return this.db.oneOrNone(query);
    }

    /**
     * Generate new access token for access API data.
     * 
     * @param data 
     * @returns AccessToken
     */
    async create(data: {
        accountId: number;
    }): Promise<AccessToken> {
        const { accountId } = data;
        const accessToken = randomBytes(16).toString('hex');

        const query: string = `INSERT INTO access_tokens (account_id, access_token, valid_until) VALUES ('${accountId}', '${accessToken}', CURRENT_TIMESTAMP + INTERVAL '${this.tokenValidityInterval}') RETURNING access_token, valid_until`;

        const result = await this.db.one(query);

        return result;
    }

    /**
     * Refresh validity of access token.
     * 
     * @param data 
     * @returns AccessToken
     */
    async refresh(data: {
        accessToken: string;
    }): Promise<AccessToken> {
        const { accessToken } = data;
        
        const query: string = `UPDATE access_tokens SET valid_until=CURRENT_TIMESTAMP + INTERVAL '${this.tokenValidityInterval}' WHERE access_token='${accessToken}' RETURNING account_id, access_token, valid_until, EXTRACT(EPOCH FROM (valid_until - CURRENT_TIMESTAMP)) AS valid_difference`;
        
        const result = await this.db.one(query);
        
        return result;
    }
}
