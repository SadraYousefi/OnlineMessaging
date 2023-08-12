import { IsBoolean , IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { DocumentMessage, PictureMessage, StringMessage, VoiceMessage } from "../entities";

export class SendMessageDto {
    
    @IsNumber()
    @IsNotEmpty()
    toUser: number ;
    
    body : VoiceMessage | PictureMessage | StringMessage | DocumentMessage;

    @IsNumber()
    @IsOptional()
    inReplayTo?: number

    @IsBoolean()
    isPinned: boolean
    
    @IsBoolean()
    isDeleted: boolean

}