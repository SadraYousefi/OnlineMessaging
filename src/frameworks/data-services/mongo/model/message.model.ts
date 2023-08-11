import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

import {
  DocumentMessage,
  PictureMessage,
  StringMessage,
  VoiceMessage,
} from "./message-body.model";
export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop({ type: Number, required: true })
  id: number;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  body: VoiceMessage | PictureMessage | StringMessage | DocumentMessage;

  @Prop({ type: Number, ref: "Message" })
  inReplyTo?: number; 

  @Prop({ type: Number, required: true })
  fromUser: number;
  
  @Prop({ type: Number, required: true })
  toUser: number;

  @Prop({ type: Date, default: Date.now() })
  date: Date;

  @Prop({ type: Boolean, default: false })
  isPinned: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
  