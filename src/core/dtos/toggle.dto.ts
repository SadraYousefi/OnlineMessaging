import { IsNotEmpty, IsString } from "class-validator";

export class ToggleDto {
  @IsString()
  @IsNotEmpty()
  messageId: string;

  @IsString()
  @IsNotEmpty()
  contactId: string;
}
