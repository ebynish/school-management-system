// src/config/schemas/message-template.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class MessageTemplate extends Document {
  @Prop({ required: true })
  type: string; // e.g., 'welcome', 'password_reset', etc.

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  content: string;
}

export type MessageTemplateDocument = MessageTemplate & Document;
export const MessageTemplateSchema = SchemaFactory.createForClass(MessageTemplate);
