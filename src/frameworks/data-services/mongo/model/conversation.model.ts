    import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
    import { HydratedDocument } from 'mongoose';
    import { Message , MessageSchema } from './message.model';

    export type ConversationDocument = HydratedDocument<Conversation>

    @Schema()
    export class Conversation {

        @Prop({type: [Number] , required: true})
        participants: number[]
        
        @Prop({type: Date , default: Date.now()})
        createdAt: Date 
         
        @Prop( { type: [MessageSchema] } )
        messages: Message[]

    }

     
    export const ConversationSchema = SchemaFactory.createForClass(Conversation);

