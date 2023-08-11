import { IsNotEmpty, IsNumber } from "class-validator"

export class ForwardMessageDto {

    @IsNumber()
    @IsNotEmpty()
    messageId: number
    
    @IsNumber()
    @IsNotEmpty()
    contactId: number
    
    @IsNumber()
    @IsNotEmpty()
    toUserId: number 

}