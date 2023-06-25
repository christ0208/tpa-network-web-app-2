import { BadRequestException, Body, Controller, Get, Headers, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { LogHistoriesService } from 'src/log-histories/log-histories.service';
import { TransactionTransferHistoriesService } from 'src/transaction-transfer-histories/transaction-transfer-histories.service';
import { UserUpdateHistoriesService } from 'src/user-update-histories/user-update-histories.service';
import { AccountsService } from './accounts.service';
import { AccountCreateDto } from './dto/account-create-dto/account-create-dto.interface';
import { AccountTransferDto } from './dto/account-transfer-dto/account-transfer-dto';
import { AccountUpdateDto } from './dto/account-update-dto/account-update-dto';
import { Account } from './interfaces/account/account.interface';

@Controller('accounts')
export class AccountsController {

  /**
   * Constructor for AccountsController.
   * 
   * @param accountsService 
   * @param logHistoriesService
   */
  constructor(private readonly accountsService: AccountsService, private readonly logHistoriesService: LogHistoriesService, private readonly userUpdateHistoriesService: UserUpdateHistoriesService, private readonly transactionTransferHistoriesService: TransactionTransferHistoriesService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll(): Promise<Account[]> {
    return this.accountsService.findAll();
  }

  /**
   * Get account details based on given access token.
   * 
   * @param authorization
   * @returns Account
   */
  @UseGuards(AuthGuard)
  @Get('/logged-in')
  async findOne(@Headers('Authorization') authorization: string): Promise<Account> {
    const accessToken = authorization.replace('Bearer', '').trim();

    const result = this.accountsService.find({
      accessToken: accessToken
    });

    if (!result) throw new BadRequestException();

    return result;
  }

  /**
   * Create account based on given account data.
   * 
   * @param dto 
   * @returns Account
   */
  @Post('/create')
  async create(@Headers('x-real-ip') xRealIP: string, @Body() dto: AccountCreateDto): Promise<Account> {
    const result = await this.accountsService.create(dto);

    if (result === null) {
      throw new BadRequestException(['E-mail with specified account number exists, cannot register account...']);
    } else {
      this.logHistoriesService.create({
        title: 'Accounts - Create Account',
        details: 'Success create account, Source: ' + xRealIP + '; E-mail: ' + dto.email
      });

      this.userUpdateHistoriesService.create({
        accountNumber: dto.accountNumber,
        email: dto.email,
        action: 'Register'
      })
    }

    return result;
  }

  /**
   * Transfer account balance from user account to target account.
   * 
   * @param accountTransferDto 
   * @returns object
   */
  @UseGuards(AuthGuard)
  @Post('/transfer')
  async transferBalance(@Headers('x-real-ip') xRealIP: string, @Headers('Authorization') authorization: string, @Body() accountTransferDto: AccountTransferDto): Promise<{ status: string; message: string; }> {
    const targetAccount = await this.accountsService.find({
      email: accountTransferDto.email,
      accountNumber: accountTransferDto.accountNumber
    });

    const accessToken = authorization.replace('Bearer', '').trim();

    const sourceAccount = await this.accountsService.find({
      accessToken: accessToken
    });

    if (targetAccount === null || targetAccount === undefined) throw new BadRequestException(['Target account with specified e-mail and account number not found.']);

    if (sourceAccount === null || sourceAccount === undefined) throw new BadRequestException(['Source account with specified e-mail and account number not found.']);

    const addBalanceResult = await this.accountsService.updateBalance(targetAccount, accountTransferDto, { balanceType: 'addition' });

    if (addBalanceResult === null || addBalanceResult === undefined) throw new BadRequestException(["Internal server error, please contact developer for further details"]);

    const subsBalanceResult = await this.accountsService.updateBalance(sourceAccount, accountTransferDto, { balanceType: 'substraction' });

    if (subsBalanceResult === null || subsBalanceResult === undefined) throw new BadRequestException(["Internal server error, please contact developer for further details"]);

    this.logHistoriesService.create({
      title: 'Accounts - Transfer Balance',
      details: 'Transferred balance from source ' + sourceAccount.account_number + '(email : ' + sourceAccount.email + ') to destination ' + targetAccount.account_number + '(email: ' + targetAccount.email + '), Source IP: ' + xRealIP
    });

    this.transactionTransferHistoriesService.create({
      sourceAccountNumber: sourceAccount.account_number,
      sourceEmail: sourceAccount.email,
      destAccountNumber: targetAccount.account_number,
      destEmail: targetAccount.email,
      balance: accountTransferDto.balance
    });

    return {
      status: '200',
      message: 'Success'
    };
  }

  /**
   * Update account using given account data.
   * 
   * @param authorization 
   * @param accountUpdateDto 
   * @returns object
   */
  @UseGuards(AuthGuard)
  @Patch('/update/:id')
  async update(@Headers('x-real-ip') xRealIP: string, @Param('id') id: number, @Body() accountUpdateDto: AccountUpdateDto): Promise<{ status: string; message: string; }> {
    const sourceAccount = await this.accountsService.find({
      accountId: id
    });

    if (sourceAccount === null || sourceAccount === undefined) throw new BadRequestException(['Source account with specified e-mail and account number not found.']);

    const result = await this.accountsService.update(sourceAccount, accountUpdateDto);

    if (result === null || result === undefined) throw new BadRequestException(["Internal server error, please contact developer for further details"]);

    this.logHistoriesService.create({
      title: 'Accounts - User Profile Update',
      details: 'Updated account profile for ' + sourceAccount.account_number + '(email: ' + sourceAccount.email + '), source IP: ' + xRealIP
    });

    this.userUpdateHistoriesService.create({
      accountNumber: sourceAccount.account_number,
      email: sourceAccount.email,
      action: 'Update'
    })

    return {
      status: '200',
      message: 'Success'
    }
  }
}
