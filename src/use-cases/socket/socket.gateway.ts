import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server , Socket} from 'socket.io'
import { User } from "src/core";
import { SendMessageDto } from "src/core/dtos";
import { mockUsers } from "usermock";
import { SocketUseCases } from "./socket.use-cases";
import { validate } from "class-validator";
import { UseFilters } from "@nestjs/common";
import { WebsocketExceptionsFilter } from "src/common/filters/socket-exception.filter";
import { ToggleDto } from "src/core/dtos/toggle.dto";
import { ForwardMessageDto } from "src/core/dtos/forward-message.dto";
import { RoomService } from "../room/room.service";

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})

@UseFilters(WebsocketExceptionsFilter)
export class ChatGateWay implements OnGatewayConnection , OnGatewayConnection {

    @WebSocketServer()
    private server : Server

    constructor(
        private readonly socketUseCases: SocketUseCases ,
        private readonly roomService: RoomService
    ){}

    @SubscribeMessage("message")
    sendMessage(@ConnectedSocket() client: Socket , @MessageBody() message: SendMessageDto) {
        const { userId } = client.handshake.query
        this.socketUseCases.messageHandler(+userId , message)
        this.server.emit('message' , message.body)
    }

    @SubscribeMessage("togglePin")
    togglePinMessage(@ConnectedSocket() client: Socket , @MessageBody() body: ToggleDto) {

        const {userId} = client.handshake.query ;
        this.socketUseCases.togglePinMessage( +body.messageId ,+userId , +body.contactId)
        this.server.emit("togglePin" , "Pin status changed")
        
    }

    @SubscribeMessage("deleteMessage")
    deleteMessage(@ConnectedSocket() client: Socket , @MessageBody() body: ToggleDto) {
        const {userId} = client.handshake.query ;
        this.socketUseCases.deleteMessage(+body.messageId , +userId , +body.contactId)
        this.server.emit("deleteMessage" , "Message Deleted")
    }

    @SubscribeMessage("forwardMessage")
    forwardMessage(@ConnectedSocket() client: Socket , @MessageBody() body: ForwardMessageDto) {
        const {userId} = client.handshake.query ;
        this.socketUseCases.forwardMessage(+body.messageId , +userId , +body.contactId , +body.toUserId)
        this.server.emit("forwardMessage" , "Message forwarded")
    }

    @SubscribeMessage("joinUniqueRoom")
    handleJoinUniqueRoom(client:Socket , user2: string) {
        const creator = client.handshake.query.userId as string
        const roomId = this.roomService.createUniqueRoom(creator, user2);
        client.join(roomId);
    }

    handleConnection(client: any, ...args: any[]) {
        
    }
 
}
