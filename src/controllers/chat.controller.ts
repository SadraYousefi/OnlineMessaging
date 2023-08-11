import { Controller, Get, Query } from "@nestjs/common";
import { Message, User } from "src/core";
import { MessageRestService } from "src/core/abstracts/chat-rest-service.abstract";
import { GetConversationMessagesDto } from "src/core/dtos";
import { GetUserChatContactsDto } from "src/core/dtos/get-contacts.dto";
import { ConversationUseCases } from "src/use-cases/conversation/conversation.use-case";
import { mockUsers } from "usermock";


@Controller('api/conversation')
// implements MessageRestService
export class ChatController  {
    constructor(
        private readonly conversationUseCases: ConversationUseCases
    ){}
    
    @Get("messages")   
    getConversationMessages(@Query() data: GetConversationMessagesDto) {
        return this.conversationUseCases.getConversationMessages(data);
    }

    @Get("user/contacts")
    getUserChatContacts(@Query() userId: GetUserChatContactsDto) { 
        return this.conversationUseCases.getUserChatContacts(+userId.userId)
    }  
 
}
