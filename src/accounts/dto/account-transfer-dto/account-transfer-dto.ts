import { IsEmail, IsPositive, Min } from "class-validator";
import { LengthEqual } from "src/common/validators/length-equal/length-equal";

export class AccountTransferDto {

    @IsEmail({}, {
        message: 'E-mail address must be in e-mail format'
    })
    email: string;

    @LengthEqual(10, {
        message: 'Account number must be 10 digits'
    })
    accountNumber: string;

    @IsPositive()
    balance: number;
}
