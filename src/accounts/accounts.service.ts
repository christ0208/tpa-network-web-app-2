import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { db } from 'src/common/database/pg/index.init';
import { AccountCreateDto } from './dto/account-create-dto/account-create-dto.interface';
import { AccountTransferDto } from './dto/account-transfer-dto/account-transfer-dto';
import { AccountUpdateDto } from './dto/account-update-dto/account-update-dto';
import { Account } from './interfaces/account/account.interface';

@Injectable()
export class AccountsService {

    constructor(private authService: AuthService) {}

    async findAll(): Promise<Account[]> {
        return db.accounts.all();
    }

    /**
     * Get account details based on given account data.
     * Possible parameterized account data:
     * - Account ID
     * - Access Token
     * 
     * @param data 
     * @returns Account
     */
    async find(data: {
        accountId?: number;
        email?: string;
        accountNumber?: string;
        accessToken?: string;
    } = {
        accountId: null,
        email: null,
        accountNumber: null,
        accessToken: null
    }): Promise<Account> {
        const { accountId, email, accountNumber, accessToken } = data;

        if (accessToken !== null && accessToken !== undefined) {
            const accessTokenDetails = await this.authService.getAccessTokenDetails({
                accessToken: accessToken
            });

            return db.accounts.get({
                accountId: accessTokenDetails.account_id
            });
        } 

        return db.accounts.get({
            accountId: accountId,
            email: email,
            accountNumber: accountNumber
        });
    }

    /**
     * Create new account based on given account data.
     * 
     * @param dto 
     * @returns Account
     */
    async create(dto: AccountCreateDto): Promise<Account> {
        const { email, accountNumber } = dto;

        const result = await db.accounts.get({
            email: email,
            accountNumber: accountNumber
        });

        if (result !== null) return null;
        
        return db.accounts.create(dto);
    }

    /**
     * Update account based on given account data.
     * 
     * @param accountTarget 
     * @param dto 
     * @returns Account
     */
     update(accountTarget: Account, dto: AccountUpdateDto): Promise<Account> {
        return db.accounts.update(accountTarget, {
            password: dto.password
        });
    }
    
    /**
     * Update account based on given account data.
     * 
     * @param accountTarget 
     * @param dto 
     * @returns Account
     */
    updateBalance(accountTarget: Account, dto: AccountTransferDto, options: { balanceType: string; }): Promise<Account> {
        const { balanceType } = options;
    
        if (balanceType === 'addition') {
            return db.accounts.update(accountTarget, {
                additionalBalance: dto.balance
            });
        } else if (balanceType === 'substraction') {
            return db.accounts.update(accountTarget, {
                substractionBalance: dto.balance
            })
        }
        
        return null;
    }

    
}
