import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server , Socket} from 'socket.io'
import { SendMessageDto } from "src/core/dtos";
import { SocketUseCases } from "./socket.use-cases";
import { UseFilters } from "@nestjs/common";
import { ToggleDto } from "src/core/dtos/toggle.dto";
import { ForwardMessageDto } from "src/core/dtos/forward-message.dto";
import { RoomService } from "../room/room.service";
import { WebsocketExceptionsFilter } from "src/common/filters";
import { validate } from "class-validator";

@WebSocketGateway({
    cors: {
        origin: '*'
    } ,
})

@UseFilters(WebsocketExceptionsFilter)
export class ChatGateWay {

    constructor(
        private readonly socketUseCases: SocketUseCases ,
        private readonly roomService: RoomService
    ){}

    @SubscribeMessage("message")
    async sendMessage(@ConnectedSocket() client: Socket , @MessageBody() message: SendMessageDto) {
        
        client.handshake.query.recipient = String(message.toUser)
        this.handleJoinUniqueRoom(client)
        const { userId } = client.handshake.query
        const room = [...client.rooms][0]
        const error = await validate(message)
        console.log(error);
        await this.validation(message , client , room)
        this.socketUseCases.messageHandler(+userId , message)
        const user = this.socketUseCases.findUserById(+userId)
        
        client.to(room).emit("message" , `${user.firstName} : ${message.body}`)
    }
   
    @SubscribeMessage("togglePin")
    togglePinMessage(@ConnectedSocket() client: Socket , @MessageBody() body: ToggleDto) {
        client.handshake.query.recipient = body.contactId
        this.handleJoinUniqueRoom(client)
        const {userId} = client.handshake.query ;
        this.socketUseCases.togglePinMessage( +body.messageId ,+userId , +body.contactId)
        const room = [...client.rooms][0]
        client.to(room).emit("togglePin" , `pin status of messageId: ${body.messageId} changed`)
        
    }

    @SubscribeMessage("deleteMessage")
    deleteMessage(@ConnectedSocket() client: Socket , @MessageBody() body: ToggleDto) {
        client.handshake.query.recipient = body.contactId
        this.handleJoinUniqueRoom(client)
        const {userId} = client.handshake.query ;
        this.socketUseCases.deleteMessage(+body.messageId , +userId , +body.contactId)
        const room = [...client.rooms][0]
        client.to(room).emit("deleteMessage" , `messageId: ${body.messageId} has been deleted`)
    }

    @SubscribeMessage("forwardMessage")
    forwardMessage(@ConnectedSocket() client: Socket , @MessageBody() body: ForwardMessageDto) {
        const {userId} = client.handshake.query ;
        this.socketUseCases.forwardMessage(+body.messageId , +userId , +body.contactId , +body.toUserId)
    }

    @SubscribeMessage("joinRoom")
    handleJoinUniqueRoom(@ConnectedSocket() client:Socket) {
        const userId = client.handshake.query.userId as string
        const recipient = client.handshake.query.recipient as string

        client.rooms.forEach(room => {
            client.leave(room)
        }) 

        const roomId = this.roomService.createUniqueRoom(userId, recipient);
        client.join(roomId);
    }

    async validation(item , client , room) {
        const validation = await validate(item)
        if(validation) {
            console.log(validation);
            client.to(room).emit("exception" , validation)
        }
    }
}
