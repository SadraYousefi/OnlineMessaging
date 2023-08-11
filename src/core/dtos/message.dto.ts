import { IsBoolean, IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional} from "class-validator";
import { UserMessageDto } from "./user-message.dto";
import { DocumentMessage, PictureMessage, StringMessage, VoiceMessage } from "../entities";

export class MessageDto {
    @IsNotEmpty()
    @IsMongoId()
    id: number;
    
    body : VoiceMessage | PictureMessage | StringMessage | DocumentMessage;

    @IsMongoId()
    @IsOptional()
    inReplyTo?: number;
    
    @IsNumber()
    fromUser: number; 
    
    @IsNumber()
    toUser: number;
    
    @IsDate()
    date:Date;
    
    @IsBoolean()
    isPinned:boolean;

    @IsBoolean()
    isDeleted:boolean;
   
}