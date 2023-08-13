import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IDataServices } from '../../../core';
import { DATA_BASE_CONFIGURATION } from '../../../configuration';
import {
  Conversation,
  ConversationSchema,
} from './model';
import { MongoDataServices } from './mongo-data-services.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name , schema : ConversationSchema} ,
    ]),
    MongooseModule.forRoot(DATA_BASE_CONFIGURATION.mongoConnectionString),
  ],
  providers: [
    {
      provide: IDataServices,
      useClass: MongoDataServices,
    },
  ],
  exports: [IDataServices],
})
export class MongoDataServicesModule {}
