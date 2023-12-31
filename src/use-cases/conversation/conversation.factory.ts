import { Injectable } from "@nestjs/common";
import { Conversation, MessageDto } from "src/core";


@Injectable()
export class ConversationFactoryService { 

    createConversation(participants: number[]): Conversation {
        const newConversation = new Conversation() ;
        newConversation.participants = participants ;
        newConversation.messages = []
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