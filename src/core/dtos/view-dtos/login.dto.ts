import { IsNotEmpty, IsNumberString } from "class-validator";

export class LoginViewDto {
    @IsNotEmpty()
    @IsNumberString()
    userId: number
}