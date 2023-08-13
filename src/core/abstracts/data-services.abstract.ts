import { Conversation } from '../entities';
import { IGenericRepository } from './generic-repository.abstract';

export abstract class IDataServices {
  abstract conversation: IGenericRepository<Conversation>
}
