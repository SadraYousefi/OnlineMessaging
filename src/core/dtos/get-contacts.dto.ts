import { IsNotEmpty, IsString } from "class-validator";

export class GetUserChatContactsDto {
    @IsNotEmpty()
    @IsString()
    userId: string
}