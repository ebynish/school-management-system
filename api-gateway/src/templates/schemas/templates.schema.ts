import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Template {
  @Prop({ required: true, unique: true })
  type: string; // The type of the template (e.g., 'admissionLetter', 'transcript', 'result')

  @Prop({ required: true })
  title: string; // The title of the template (e.g., 'Admission Letter Template')

  @Prop({ required: true })
  content: string; // The HTML or plain-text content of the template

  @Prop({ default: '' })
  description: string; // A brief description of the template

  @Prop({ type: Map, of: String, default: {} })
  placeholders: Record<string, string>; // Placeholder keys with descriptions (e.g., {{name}}: 'Student name')

  @Prop({ default: Date.now })
  createdAt: Date; // The date the template was created

  @Prop({ default: Date.now })
  updatedAt: Date; // The date the template was last updated
}

export type TemplateDocument = Template & Document;
export const TemplateSchema = SchemaFactory.createForClass(Template);
