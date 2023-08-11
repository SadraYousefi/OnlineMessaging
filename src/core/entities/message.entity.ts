import {User} from './user.entity'

export class VoiceMessage {
    duration: number ;
    audioPath: string ;
}

export class StringMessage {
    text: string ;
}

export class PictureMessage {
    caption: string ;
    imagePath: string ;
}

export class DocumentMessage {
    title: string ;
    fileSize: number ;
    documentPath: string ;
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
