import { Injectable } from "@nestjs/common";
import { MessageDto } from "src/core/dtos";
import { Conversation } from "src/core/entities";

@Injectable()
export class ConversationFactoryService { 

    createConversation(participants: number[] , message: MessageDto): Conversation {
        const newConversation = new Conversation() ;
        newConversation.participants = participants ;
        newConversation.messages = []
        newConversation.messages.push(message)
        return newConversation
    }

    createMessage(conversation: Conversation , message: MessageDto): Conversation {
        conversation.messages.push(message)
        return conversation

    }

    updateConversationMessage(conversation: Conversation , message: MessageDto): Conversation {
        conversation.messages.find(item => {
            item.id == message.id
            item = message
        })
        return conversation
    }
}  