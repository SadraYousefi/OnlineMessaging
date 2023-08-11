import { Module } from "@nestjs/common";
import { SocketUseCases } from "./socket.use-cases";
import { ChatGateWay } from "./socket.gateway";
import { DataServicesModule } from "src/services/data-services/data-services.module";
import { ConversationModule } from "../conversation/conversation.module";
import { RoomModule } from "../room/room.module";

@Module({
  imports : [DataServicesModule , ConversationModule , RoomModule] ,
  providers: [SocketUseCases , ChatGateWay ],
  exports: [SocketUseCases],
})
export class SocketModule {}
