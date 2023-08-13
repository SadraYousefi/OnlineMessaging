import { IsNotEmpty, IsNumber } from "class-validator";

export class ToggleDto {
  @IsNumber()
  @IsNotEmpty()
  messageId: number;
  
  @IsNumber()
  @IsNotEmpty()
  contactId: number;
}
