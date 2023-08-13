import { Module } from "@nestjs/common";
import { SocketUseCases } from "./socket.use-cases";
import { ChatGateWay } from "./socket.gateway";
import { DataServicesModule } from "src/services/data-services/data-services.module";
import { ConversationModule } from "../conversation/conversation.module";
import { RoomModule } from "../room/room.module";
import { FileModule } from "src/services/File-service/file.module";

@Module({
  imports : [DataServicesModule , ConversationModule , RoomModule , FileModule] ,
  providers: [SocketUseCases , ChatGateWay ],
  exports: [SocketUseCases],
})
export class SocketModule {}
