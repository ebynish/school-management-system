// src/email/schemas/email-history.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class EmailHistory {
  @Prop({ required: true })
  to: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  html: string;

  @Prop({ default: false })
  isSent: boolean;

  @Prop({ type: Date })
  sentAt?: Date;

  @Prop({ default: 0 })
  retries: number;

  @Prop({ type: String })
  templateType: string

  @Prop({ type: Object })
  templateVariables: any
}

export type EmailHistoryDocument = EmailHistory & Document;
export const EmailHistorySchema = SchemaFactory.createForClass(EmailHistory);
