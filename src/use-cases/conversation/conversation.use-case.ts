import { Injectable } from "@nestjs/common";
import { IDataServices, Message, User , MessageDto , GetConversationMessagesDto , Conversation} from "src/core";
import { mockUsers } from "usermock";
import { ConversationFactoryService } from "./conversation.factory";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class ConversationUseCases {

    constructor(
        private readonly dataService: IDataServices ,
        private readonly conversationFactory: ConversationFactoryService,
    ){}

    createConversation(participants: number[]): Promise<Conversation>{

        const conversation = this.conversationFactory.createConversation(participants)
        return this.dataService.conversation.create(conversation) ;
    }


    createMessage(conversation, message: MessageDto):Promise<Conversation> {
        const updatedConversation = this.conversationFactory.createMessage(conversation , message) ;
        return this.dataService.conversation.update(conversation._id , updatedConversation)
    }

    updateConversationMessage(conversation , message: MessageDto): Promise<Conversation> {

        const newConversation = this.conversationFactory.updateConversationMessage(conversation , message) ;
        
        return this.dataService.conversation.update(conversation._id , newConversation)
    }

    findConversation(participants: number[]): Promise<Conversation> {
       return this.dataService.conversation.findByparticipants(participants)
    }

    async findConversationAndMessage(messageId: number , userId: number , contactId: number):Promise<[Conversation, Message]> {
        const conversation = await this.findConversation([userId , contactId])
        const message = conversation.messages.find(message => message.id == messageId) ;
        if(!message)
            throw new WsException("No message Found")
        return [conversation , message]
       }
    

    async findOrCreateConversation(participants: number[]): Promise<Conversation> {
        let conversation =  await this.findConversation(participants)
        if(!conversation) {
            return await this.createConversation(participants)
        }

        return conversation
    }   


    async getConversationMessages(body: GetConversationMessagesDto): Promise<Message[]> {
        const conversation = await this.findConversation([+body.userId , +body.contactId])        
        return conversation.messages ;
    }
    async getUserChatContacts(userId: number): Promise<User[]> {
        const conversations = await this.dataService.conversation.find({participants: userId})
        let users = []
        Object.keys(conversations).forEach(key => {
            users.push(conversations[key].participants.find(participant => participant !== userId))
        })
        const detailedUsers = [] 
        users.forEach(item => {
            const user = mockUsers.find(user => user.id == item)
            detailedUsers.push(user)
        })
        
        return detailedUsers ;
    }
}