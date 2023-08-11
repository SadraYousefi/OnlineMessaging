import { OnlineStatus } from "../enums";

export class UserMessageDto {
  firstName: string;
  lastName: string;
  lastSeen: Date;
  onlineStatus: OnlineStatus;
}
