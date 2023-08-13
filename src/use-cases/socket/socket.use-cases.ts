
import { Injectable } from "@nestjs/common";
import { DocumentMessage, Message, PictureMessage, StringMessage, User, VoiceMessage } from "src/core";
import { MessageBodyDto, SendMessageDto } from "src/core/dtos";
import { ConversationUseCases } from "../conversation/conversation.use-case";
import { mockUsers } from "usermock";
import { Conversation } from "src/core/entities/conversation.entity";
import { WsException } from "@nestjs/websockets";
import { FileService } from "src/services/File-service/file.service";
import { MessageTypes } from "src/core/enums";

@Injectable()
export class SocketUseCases {
    constructor(
        private readonly conversationUseCases: ConversationUseCases,
        private readonly fileService: FileService
    ){}


    async messageHandler(userId: number , receivedMessage: SendMessageDto): Promise<any> {
        try {
            const recipient = receivedMessage.toUser ;
            this.checkSendMessageTerms(userId , receivedMessage) ;

            let conversation = await this.conversationUseCases.findOrCreateConversation([userId , recipient])

            const message: Message = await this.messageBuilder(userId , receivedMessage , conversation)
            await this.conversationUseCases.createMessage(conversation , message)

            let data = message.body as VoiceMessage ;
                if(data?.filePath){
                    return data.filePath
            }   else {
                let data = message.body as StringMessage
                return data?.text
            }
            
        } catch (error) {
            throw Error(error)
        }
}
 
 


    async togglePinMessage(messageId: number , userId: number , contactId: number): Promise<Conversation> {

        const [conversation , message] = await this.conversationUseCases.findConversationAndMessage(messageId , userId , contactId) 
        
        const toggle = message.isPinned == true ? false : true ;
        message.isPinned = toggle ;
        return await this.conversationUseCases.updateConversationMessage(conversation , message)
    }


    
    async deleteMessage(messageId: number, userId: number, contactId: number): Promise<Conversation> {
        
        const [conversation , message] = await this.conversationUseCases.findConversationAndMessage(messageId , userId , contactId) 

        if(message.isDeleted == true)
            throw new WsException("This message is already deleted")

        
        message.isDeleted = true ;

        return await this.conversationUseCases.updateConversationMessage(conversation , message)
   }  

   async forwardMessage(messageId: number, userId: number, contactId: number, toUserId: number): Promise<any> {

    const [conversation , message] = await this.conversationUseCases.findConversationAndMessage(messageId , userId , contactId)
    
    if(message.isDeleted == true)
        throw new WsException("This message is already deleted")

        let data = message.body as VoiceMessage ;
        if(data?.filePath){
            return data.filePath
    }   else {
        let data = message.body as StringMessage
        return data?.text
    }
   }
 

    async messageBuilder(fromUser: number , receivedMessage: SendMessageDto , conversation: Conversation): Promise<Message> {

        const id = this.messageIdGenerator(conversation)
        const date = new Date() ;

        const messageBody = receivedMessage.body ; 
        const bodyData: StringMessage | PictureMessage | VoiceMessage | DocumentMessage = await this.saveMessage(messageBody , conversation.participants)

        const {body , ...rest} = receivedMessage
        const message: Message = {id , fromUser , date , body : bodyData , ...rest }
        return message ;
    }

    async saveMessage(messageBody: MessageBodyDto , pathArg: number[]) {

        const data = Buffer.from(messageBody.data , "base64")
        
        if(messageBody.type == MessageTypes.string) {
            const text = data.toString("utf8")
            let message: StringMessage ;
            return message = {
                text
            }
        }

        if(!messageBody.extName)
            throw new WsException("this object should have extname for the file")

        const filePath = this.fileService.filePathGenerator(pathArg , messageBody.extName) ;

        if(messageBody.type == MessageTypes.picture) {
            let message: PictureMessage ;
            this.fileService.writeBinaryToFile(filePath , data)
            return message = {
                caption: messageBody?.caption ,
                filePath
            }
        }

        if(messageBody.type == MessageTypes.document) {
            let message: DocumentMessage ;
            this.fileService.writeBinaryToFile(filePath , data)
            const fileSize = Buffer.from(messageBody.data).byteLength ;
            return message = {
                title: messageBody?.caption ,
                fileSize ,
                filePath
            } 

        }


        if(messageBody.type == MessageTypes.voice) {
            let message: VoiceMessage ;
            this.fileService.writeBinaryToFile(filePath , data)
            const fileSize = Buffer.from(messageBody.data).byteLength ;
            return message = {
                duration: fileSize  , 
                filePath
            } 

        }
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
