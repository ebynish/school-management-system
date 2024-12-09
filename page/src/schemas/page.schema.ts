import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PageDocument = Page & Document;

@Schema({ timestamps: true })
export class Page {
  @Prop({ required: true })
  type: string; 

  @Prop({ required: true })
  title: string; 

  @Prop()
  description: string;  

  @Prop()
  backgroundColor: string; 

  @Prop()
  textColor: string;  // Optional text color for the component

  @Prop()
  icon: string;  // Optional icon for components like navbar, card, or hero

  @Prop()
  linkUrl: string;  

  @Prop()
  imageUrl: string;  

  @Prop({ type: [String] })
  listItems: string[];  

  @Prop({ type: Number, default: 1 })
  order: number;  

  @Prop({ default: false })
  isFeatured: boolean; 

  @Prop({ default: false })
  create: boolean; 

  @Prop({ default: false })
  search: boolean; 
  
  @Prop({ default: false })
  statusCard: boolean; 

  @Prop({ type: Object })
  createDetails: object; 

  @Prop({type: Object})
  additionalProps: any;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Page' }] })
  nestedComponents: Types.ObjectId[]; 
}

export const PageSchema = SchemaFactory.createForClass(Page);
