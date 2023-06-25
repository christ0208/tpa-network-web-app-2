import { IDatabase, IMain } from "pg-promise";
import { LogHistory } from "src/log-histories/interfaces/log-history/log-history.interface";

export class LogHistoryRepository {
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
     * Create new log history for logging.
     * 
     * @param data 
     * @returns LogHistory
     */
    async create(data: {
        title: string;
        details: string;
    }): Promise<LogHistory> {
        const { title, details } = data;
        
        const query: string = `INSERT INTO log_histories (title, details) VALUES ('${title}', '${details}') RETURNING id, title, details, created_at`;
        const result = await this.db.one(query);

        return result;
    }
}
