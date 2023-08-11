import { GetConversationMessagesDto } from "../dtos";
import { Message, User } from "../entities";

export abstract class MessageRestService {

    abstract getUserChatContacts(userId: User):Promise<User[]>;
    abstract getConversationMessages(data: GetConversationMessagesDto): Promise<Message[]>;

}


