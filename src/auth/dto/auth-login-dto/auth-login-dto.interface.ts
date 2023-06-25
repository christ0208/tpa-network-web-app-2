import { BaseDto } from "src/common/dto/base-dto/base-dto";

export class AuthLoginDto extends BaseDto {
    email: string;
    accountNumber: string;
    password: string;
}
