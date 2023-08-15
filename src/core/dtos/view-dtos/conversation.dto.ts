import { IsNotEmpty, IsNumberString } from "class-validator";

export class GetConversationViewDto {
    
    @IsNotEmpty()
    @IsNumberString()
    userId: number
}