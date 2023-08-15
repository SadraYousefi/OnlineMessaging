import { SocketModule } from "./use-cases/socket/socket.module";
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import {
  ChatController, ClientController,
} from "./controllers";
import { DataServicesModule } from "./services/data-services/data-services.module";
import { ConversationModule } from "./use-cases/conversation/conversation.module";
import { AuthHandlerMiddleWare, GlobalExceptionFilter } from "./common";
import { APP_FILTER } from "@nestjs/core";
import { AuthMiddleWare } from "./common/middlewares/auth-guard.middleware";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname , ".." , ".." , "public") ,
    }),
    SocketModule,
    ConversationModule,
    DataServicesModule,
  ],
  controllers: [
    ChatController,
    ClientController,
  ],
  providers: [
    {
      provide: APP_FILTER ,
      useClass: GlobalExceptionFilter  ,
    }
  ],
})


export class AppModule  {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthHandlerMiddleWare)
    .forRoutes(ChatController)

    consumer.apply(AuthMiddleWare)
    .exclude(
      {path: "view/login" , method: RequestMethod.ALL} ,
      )
    .forRoutes(ClientController)
  }
}
