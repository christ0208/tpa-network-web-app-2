import { Injectable } from '@nestjs/common';
import { Account } from 'src/accounts/interfaces/account/account.interface';
import { db } from 'src/common/database/pg/index.init';
import { AuthLoginDto } from './dto/auth-login-dto/auth-login-dto.interface';
import { AccessToken } from './interfaces/access-token/access-token.interface';

@Injectable()
export class AuthService {

    /**
     * Provides range of validity difference to trigger refresh token's expiration time.
     * 
     * @var { min: number, max: number }
     */
    private refreshValidityRange: {
        min: number;
        max: number;
    };

    /**
     * Constructor for AuthService.
     */
    constructor() {
        this.refreshValidityRange = {
            min: 0, // 0 seconds
            max: 180 // 180 seconds -> 3 minutes
        }
    }

    /**
     * Authentication login service to get access token.
     * 
     * @param authLoginDto 
     * @returns AccessToken
     */
    async login(authLoginDto: AuthLoginDto): Promise<AccessToken> {
        const foundAccount: Account = await db.accounts.findByCredential(authLoginDto);

        if (!foundAccount) return null;
        else return this.generateAccessToken(foundAccount);
    }

    /**
     * Check validity of given access token.
     * 
     * @param data 
     * @returns AccessToken
     */
    async checkAccessToken(data: {
        accountId?: number;
        accessToken?: string;
    } = {
        accountId: null,
        accessToken: null
    }, needRenew: boolean = false): Promise<AccessToken> {
        const { accessToken } = data;

        let foundAccessToken: AccessToken = await this.getAccessTokenDetails(data);

        if (!foundAccessToken) return null;
        // if access token validity is below 0 minute (0 seconds) left, return empty data.
        else if (foundAccessToken.valid_difference && foundAccessToken.valid_difference < this.refreshValidityRange.min) return null;
        // if access token validity is between 0-3 minute (0 - 180 seconds) left, renew the token.
        else if (foundAccessToken.valid_difference && needRenew && foundAccessToken.valid_difference <= this.refreshValidityRange.max && foundAccessToken.valid_difference >= this.refreshValidityRange.min)
            foundAccessToken = await db.accessTokens.refresh({
                accessToken: accessToken
            });
        
        return foundAccessToken;
    }

    /**
     * Check validity of given access token for NestJS middleware guard usage.
     * 
     * @param data 
     * @returns boolean
     */
     async checkAccessTokenForGuard(data: {
        accountId?: number;
        accessToken?: string;
    } = {
        accountId: null,
        accessToken: null
    }, needRenew: boolean = false): Promise<boolean> {
        const { accessToken } = data;

        let foundAccessToken: AccessToken = await this.getAccessTokenDetails(data);

        if (!foundAccessToken) return false;
        // if access token validity is below 0 minute (0 seconds) left, return empty data.
        else if (foundAccessToken.valid_difference && foundAccessToken.valid_difference < this.refreshValidityRange.min) return false;
        // if access token validity is between 0-3 minute (0 - 180 seconds) left, renew the token.
        else if (foundAccessToken.valid_difference && needRenew && foundAccessToken.valid_difference <= this.refreshValidityRange.max && foundAccessToken.valid_difference >= this.refreshValidityRange.min)
            foundAccessToken = await db.accessTokens.refresh({
                accessToken: accessToken
            });
        
        return true;
    }

    /**
     * Get access token record in database.
     * 
     * @param data 
     * @returns AccessToken
     */
     async getAccessTokenDetails(data: {
        accountId?: number;
        accessToken?: string;
    } = {
        accountId: null,
        accessToken: null
    }): Promise<AccessToken> {
        const { accountId, accessToken } = data;

        return db.accessTokens.get({
            accountId: accountId,
            accessToken: accessToken
        });
    }

    /**
     * Generate new access token based on given account.
     * 
     * @param account 
     * @returns AccessToken
     */
    private async generateAccessToken(account: Account): Promise<AccessToken> {
        return await db.accessTokens.create({
            accountId: account.id
        });
    }
}
