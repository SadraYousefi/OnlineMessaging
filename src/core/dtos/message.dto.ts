import { IsBoolean, IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional} from "class-validator";
import { DocumentMessage, PictureMessage, StringMessage, VoiceMessage } from "../entities";

export class MessageDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;
    
    body : VoiceMessage | PictureMessage | StringMessage | DocumentMessage;

    @IsOptional()
    @IsNumber()
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