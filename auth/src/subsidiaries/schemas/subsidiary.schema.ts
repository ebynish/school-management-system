import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Subsidiary {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  state: string;

  @Prop({ type: String, required: true })
  country: string;

  @Prop({ type: String})
  logo: string;


}

export type SubsidiaryDocument = Subsidiary & Document;
export const SubsidiarySchema = SchemaFactory.createForClass(Subsidiary);
