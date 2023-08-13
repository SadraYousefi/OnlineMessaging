import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class VoiceMessage {

    @Prop({type: Number , required: true})
    duration: number
    @Prop({type: String , required: true})
    filePath: string
}

@Schema()
export class PictureMessage {
    @Prop({type: String , required: true})
    caption: string
    @Prop({type: String , required: true})
    filePath: string
}

@Schema()
export class StringMessage {
    @Prop({type: String , required: true})
    text: string
}

@Schema()
export class DocumentMessage {
    @Prop({type: String})
    title: string
    
    @Prop({type: Number , required: true})
    fileSize: number

    @Prop({type: String , required: true})
    filePath: string
}