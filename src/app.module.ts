import { SocketModule } from "./use-cases/socket/socket.module";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import {
  ChatController,
} from "./controllers";
import { DataServicesModule } from "./services/data-services/data-services.module";
import { ConversationModule } from "./use-cases/conversation/conversation.module";
import { AuthHandlerMiddleWare, GlobalExceptionFilter } from "./common";
import { APP_FILTER } from "@nestjs/core";

@Module({
  imports: [
    SocketModule,
    ConversationModule,
    DataServicesModule,
  ],
  controllers: [
    ChatController,
  ],
  providers: [
    {
      provide: APP_FILTER ,
      useClass: GlobalExceptionFilter  ,
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthHandlerMiddleWare).forRoutes("*")
  }
}
