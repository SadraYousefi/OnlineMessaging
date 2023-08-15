import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WsException } from "@nestjs/websockets";
import { UnauthorizedException, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
import { Socket} from 'socket.io'
import { SocketUseCases } from "./socket.use-cases";
import { RoomService } from "../room/room.service";
import { SendMessageDto , ToggleDto , ForwardMessageDto } from "src/core";

@WebSocketGateway({
    cors: {
        origin: '*'
    } ,
})

@UsePipes(new ValidationPipe({whitelist: true}))
export class ChatGateWay implements OnGatewayConnection {
    

    constructor(
        private readonly socketUseCases: SocketUseCases ,
        private readonly roomService: RoomService
    ){}


    handleConnection(socket: Socket) {
        const token = socket?.handshake?.headers?.authorization ;
        if(!token)
            return this.disconnect(socket)
        const user = this.socketUseCases.findUserById(+token) ;
        if(!user)
            return this.disconnect(socket)
        socket['user'] = user.id
        const recipient = socket?.handshake?.query?.recipientId ; 
        if(!recipient) 
            throw new WsException("BadRequest") ;

        const room = this.handleJoinUniqueRoom(socket) ;
        socket['room'] = room
    }

    @SubscribeMessage("message")
    async sendMessage(@ConnectedSocket() client: Socket , @MessageBody() message: SendMessageDto) {
        const userId = client['user']
        const finalMessage = await this.socketUseCases.messageHandler(+userId , message)
        const user = this.socketUseCases.findUserById(+userId)
        client.to(client['room']).emit("message" , finalMessage)

    }
   
    @SubscribeMessage("togglePin")
    togglePinMessage(@ConnectedSocket() client: Socket , @MessageBody() body: ToggleDto) {
  
        const userId = client['user']
        this.socketUseCases.togglePinMessage( +body.messageId ,+userId , +body.contactId)
        client.to(client['room']).emit("message" , `pin status of messageId: ${body.messageId} changed`)

    }
  
    @SubscribeMessage("deleteMessage")
    deleteMessage(@ConnectedSocket() client: Socket , @MessageBody() body: ToggleDto) {
        const userId = client['user']
        this.socketUseCases.deleteMessage(+body.messageId , +userId , +body.contactId)
        client.to(client['room']).emit("message" , `System: messageId: ${body.messageId} has been deleted`)

    }

    @SubscribeMessage("forwardMessage")
     async forwardMessage(@ConnectedSocket() client: Socket , @MessageBody() body: ForwardMessageDto) {
        const room = "2"
        const userId = client['user']
         const response = await this.socketUseCases.forwardMessage(+body.messageId , +userId , +body.contactId , +body.toUserId)
         client.to(client['room']).emit("message" , `System: ${response}  ---forwarded to you !`)
    } 

    @SubscribeMessage("joinRoom")
    handleJoinUniqueRoom(client: Socket) {
        const userId = client['user']
        const recipient = client.handshake.query.recipientId as string  
        const roomId = this.roomService.createUniqueRoom(userId, recipient);
        client.rooms.forEach(room => {
            client.leave(room)
        })

        client.join(roomId);
        client.emit("joinroom" , `you joind this room ${roomId}`)
        return roomId
    }
    
    private disconnect(socket: Socket) {
        socket.emit('exception' , new UnauthorizedException())
        socket.disconnect(true);
    }
}
