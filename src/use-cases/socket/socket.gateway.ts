import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
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
    }

    @SubscribeMessage("message")
    async sendMessage(@ConnectedSocket() client: Socket , @MessageBody() message: SendMessageDto) {
        const room = this.handleJoinUniqueRoom(client , String(message.toUser))
        const userId = client['user']
        const finalMessage = await this.socketUseCases.messageHandler(+userId , message)
        const user = this.socketUseCases.findUserById(+userId)
        client.to(room).emit("message" , `${user.firstName} : ${finalMessage}`)

    }
   
    @SubscribeMessage("togglePin")
    togglePinMessage(@ConnectedSocket() client: Socket , @MessageBody() body: ToggleDto) {

        const room = this.handleJoinUniqueRoom(client , String(body.contactId))
        const userId = client['user']
        this.socketUseCases.togglePinMessage( +body.messageId ,+userId , +body.contactId)
        client.to(room).emit("message" , `pin status of messageId: ${body.messageId} changed`)
        
    }

    @SubscribeMessage("deleteMessage")
    deleteMessage(@ConnectedSocket() client: Socket , @MessageBody() body: ToggleDto) {
        const room = this.handleJoinUniqueRoom(client , String(body.contactId))
        const userId = client['userId']
        this.socketUseCases.deleteMessage(+body.messageId , +userId , +body.contactId)
        client.to(room).emit("message" , `System: messageId: ${body.messageId} has been deleted`)
    }

    @SubscribeMessage("forwardMessage")
     async forwardMessage(@ConnectedSocket() client: Socket , @MessageBody() body: ForwardMessageDto) {
         const room = this.handleJoinUniqueRoom(client , String(body.toUserId))
        const userId = client['user']
         const response = await this.socketUseCases.forwardMessage(+body.messageId , +userId , +body.contactId , +body.toUserId)
         client.to(room).emit("message" , `System: ${response}  ---forwarded to you !`)
    } 

    handleJoinUniqueRoom(client:Socket , recipient: string) {
        const userId = client['user'] as string
        const roomId = this.roomService.createUniqueRoom(userId, recipient);
        
        client.rooms.forEach(room => {
            client.leave(room)
        })

        client.join(roomId);
        return roomId
    }
    
    private disconnect(socket: Socket) {
        socket.emit('exception' , new UnauthorizedException())
        socket.disconnect(true);
    }
}
