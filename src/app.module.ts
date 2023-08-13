import { SocketModule } from "./use-cases/socket/socket.module";
import { Module } from "@nestjs/common";
import {
  AppController,
  BookController,
  AuthorController,
  GenreController,
  ChatController,
} from "./controllers";
import { DataServicesModule } from "./services/data-services/data-services.module";
import { BookUseCasesModule } from "./use-cases/book/book-use-cases.module";
import { AuthorUseCasesModule } from "./use-cases/author/author-use-cases.module";
import { GenreUseCasesModule } from "./use-cases/genre/genre-use-cases.module";
import { CrmServicesModule } from "./services/crm-services/crm-services.module";
import { ConversationModule } from "./use-cases/conversation/conversation.module";

@Module({
  imports: [
    SocketModule,
    ConversationModule,
    DataServicesModule,
    BookUseCasesModule,
    AuthorUseCasesModule,
    GenreUseCasesModule,
    CrmServicesModule,
  ],
  controllers: [
    AppController,
    BookController,
    AuthorController,
    GenreController,
    ChatController,
  ],
  providers: [],
})
export class AppModule {
}
