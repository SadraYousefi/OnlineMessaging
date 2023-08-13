import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDataServices } from '../../../core';
import { MongoGenericRepository } from './mongo-generic-repository';
import {
  Conversation,
  ConversationDocument,
} from './model';

@Injectable()
export class MongoDataServices
  implements IDataServices, OnApplicationBootstrap
{
  conversation: MongoGenericRepository<Conversation>;

  constructor(
    @InjectModel(Conversation.name)
    private ConversationRepository: Model<ConversationDocument>
  ) {}

  onApplicationBootstrap() {
    this.conversation = new MongoGenericRepository<Conversation>(this.ConversationRepository)
  }
}
