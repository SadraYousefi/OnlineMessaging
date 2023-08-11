
import { Injectable } from "@nestjs/common";
import { IDataServices, Message, User } from "src/core";
import { SendMessageDto } from "src/core/dtos";
import { ConversationUseCases } from "../conversation/conversation.use-case";
import { mockUsers } from "usermock";
import { Conversation } from "src/core/entities/conversation.entity";
import { WsException } from "@nestjs/websockets";
import { RoomService } from "../room/room.service";

@Injectable()
export class SocketUseCases {
    constructor(
        private readonly conversationUseCases: ConversationUseCases,
        private readonly roomService : RoomService
    ){}


    // sendMessage
    async messageHandler(userId: number , receivedMessage: SendMessageDto): Promise<Conversation> {
        const recipient = receivedMessage.toUser ;
        this.checkSendMessageTerms(userId , receivedMessage) ;

        const conversation = await this.conversationUseCases.findConversation([userId , recipient])

        const message = this.messageBuilder(userId , receivedMessage , conversation)
        
        if(!conversation) {
            const participants = [userId , recipient]
            return await this.conversationUseCases.createConversation(participants , message)
        }

        return await this.conversationUseCases.createMessage(conversation , message)
}
 
 

    //ToggleMessage
    async togglePinMessage(messageId: number , userId: number , contactId: number): Promise<Conversation> {

        const [conversation , message] = await this.conversationUseCases.findConversationAndMessage(messageId , userId , contactId) 
        
        const toggle = message.isPinned == true ? false : true ;
        message.isPinned = toggle ;
        return await this.conversationUseCases.updateConversationMessage(conversation , message)
    }


    
    //DeleteMessage
    async deleteMessage(messageId: number, userId: number, contactId: number): Promise<Conversation> {
        
        const [conversation , message] = await this.conversationUseCases.findConversationAndMessage(messageId , userId , contactId) 

        if(message.isDeleted == true)
            throw new WsException("This message is already deleted")

        message.isDeleted = true ;

        return await this.conversationUseCases.updateConversationMessage(conversation , message)
   }  

   //ForwardMessage
   async forwardMessage(messageId: number, userId: number, contactId: number, toUserId: number): Promise<Conversation> {

    const [conversation , message] = await this.conversationUseCases.findConversationAndMessage(messageId , userId , contactId)

    
    if(message.isDeleted == true)
        throw new WsException("This message is already deleted")

        
    const forwardedMessage: SendMessageDto = {
        toUser: toUserId ,
        body: message.body ,
        isDeleted: false ,
        isPinned: false ,
    }
    return await this.messageHandler(userId , forwardedMessage)
    
   }


    messageBuilder(fromUser: number , receivedMessage: SendMessageDto , conversation: Conversation): Message {

        const id = this.messageIdGenerator(conversation)
        const date = new Date() ;
        const message: Message = {id , fromUser , date , ...receivedMessage }
        return message ;
    }


    messageIdGenerator(conversation: Conversation): number { 

        const lastMessage = conversation?.messages[conversation.messages.length-1]
        return lastMessage ? lastMessage.id + 1 : 1

    }


    checkSendMessageTerms(userId: number , message: SendMessageDto) {
        if(userId == message.toUser)
            throw new WsException("You cant send message to yourself !")
        const recipient = this.findUserById(message.toUser) ;
        if(!recipient)
            throw new WsException("there is no user match this id") ;
        if(!this.checkRecipientIsUserContact(userId , recipient.id))
            throw new WsException("This user is not your contact")
    }

 
    findUserById(id: number): User {
        const user = mockUsers.find(item => item.id == id)
        return user
    }

    checkUserExist(id: number): Boolean {
        const user = this.findUserById(id)
        if(!user)
            throw new WsException("No user found")
        return true
    }

    checkRecipientIsUserContact(userId: number , recipientId: number): Boolean {
        const user = this.findUserById(userId)
        return user.contacts.find(item => item == recipientId) ? true : false
    }
}
