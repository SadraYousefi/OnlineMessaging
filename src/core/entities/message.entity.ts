import {User} from './user.entity'
 
export class VoiceMessage {
    duration: number ;
    filePath: string ;
}

export class StringMessage {
    text: string ;
}

export class PictureMessage {
    caption?: string ;
    filePath: string ;
}

export class DocumentMessage {
    title: string ;
    fileSize: number ;
    filePath: string ;
}


export class Message {
    id: number;
    body: VoiceMessage | PictureMessage | StringMessage | DocumentMessage;
    inReplyTo?: number;
    fromUser: number;
    toUser: number;
    date: Date;
    isPinned: boolean;
    isDeleted: boolean;
   }
