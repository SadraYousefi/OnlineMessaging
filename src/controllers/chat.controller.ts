import { Controller, Get, Query , Request } from "@nestjs/common";
import { GetConversationMessagesDto } from "src/core/dtos";
import { GetUserChatContactsDto } from "src/core/dtos/get-contacts.dto";
import { ConversationUseCases } from "src/use-cases/conversation/conversation.use-case";


@Controller('api/conversation')
export class ChatController  {
    constructor(
        private readonly conversationUseCases: ConversationUseCases
    ){}
    
    @Get("messages")   
    getConversationMessages(@Query() data: GetConversationMessagesDto , @Request() req) {
        // console.log(req.user);
        return this.conversationUseCases.getConversationMessages(data);
    }

    @Get("user/contacts")
    getUserChatContacts(@Query() userId: GetUserChatContactsDto) { 
        return this.conversationUseCases.getUserChatContacts(+userId.userId)
    }  
 
}
