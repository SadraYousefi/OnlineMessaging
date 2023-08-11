import { Message } from "./message.entity";

export class Conversation {
    participants : number[] 
    messages: Message[]
    createdAt: Date
}  