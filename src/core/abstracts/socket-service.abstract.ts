import { SendMessageDto } from "../dtos";
import { User } from "../entities";


export abstract class MessageService {

    abstract togglePinMessage(messageId: string,userId: User, contactId: User): Promise<void>;
    abstract deleteMessage(messageId: string,userId: User, contactId: User): Promise<void>;
    abstract forwardMessage(messageId: string, userId: User,contactId: User, toUserId: User): Promise<void>;
    abstract sendMessage(userId: User,contactId: User, message: SendMessageDto): Promise<void>;

}