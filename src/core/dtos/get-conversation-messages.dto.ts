import {  IsBooleanString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class GetConversationMessagesDto {

  @IsNotEmpty()
  @IsString()
  userId: string
  
  @IsNotEmpty()
  @IsString()
  contactId: string

  
  @IsOptional()
  @IsString()
  textLike?: string;
  
  @IsOptional()
  @IsBooleanString()
  onlyPinned: boolean;
}
