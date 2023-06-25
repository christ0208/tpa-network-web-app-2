import { IsOptional, MinLength } from "class-validator";

export class AccountUpdateDto {

    @IsOptional()
    @MinLength(6)
    password: string;
}
