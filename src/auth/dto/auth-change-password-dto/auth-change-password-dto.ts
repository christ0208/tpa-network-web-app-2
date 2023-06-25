import { MinLength } from "class-validator";
import { IsEqualToVar } from "src/common/validators/is-equal-to-var/is-equal-to-var";

export class AuthChangePasswordDto {

    @MinLength(6)
    current_password: string;

    @MinLength(6)
    new_password: string;

    @IsEqualToVar('new_password', {
        message: "Confirm new password and new password must be the same."
    })
    confirm_new_password: string;
}
