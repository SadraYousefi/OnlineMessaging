import { Module } from "@nestjs/common";
import { ConversationUseCases } from "./conversation.use-case";
import { DataServicesModule } from "src/services/data-services/data-services.module";
import { ConversationFactoryService } from "./conversation.factory";

@Module({
    imports: [DataServicesModule] ,
    providers: [ConversationUseCases , ConversationFactoryService], 
    exports: [ConversationUseCases , ConversationFactoryService] , 
})

export class ConversationModule {
}