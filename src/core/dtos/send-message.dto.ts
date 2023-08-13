import { IsBase64, IsBoolean , IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested, isString } from "class-validator";
import { MessageTypes } from "../enums";
import { Transform, TransformFnParams, Type } from "class-transformer";



export class MessageBodyDto {
    @IsEnum(MessageTypes)
    type: MessageTypes

    @IsOptional()
    @IsString()
    extName?: string

    @IsOptional()
    @IsString()
    caption?: string

    
    @IsBase64()
    data: string
} ;

export class SendMessageDto {
    
    @IsNumber()
    @IsNotEmpty()
    toUser: number ;

        
    @ValidateNested()
    @Type(()=> MessageBodyDto)
    body : MessageBodyDto ;

    @IsNumber()
    @IsOptional()
    inReplayTo?: number

    @IsBoolean()
    isPinned: boolean
    
    @IsBoolean()
    isDeleted: boolean

}

