import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Company {
  @Prop({ type: String, required: true })
  name: string;

  @Prop([{ type: Types.ObjectId, ref: 'Subsidiary' }])
  subsidiaries: string[]; 
  

}

export type CompanyDocument = Company & Document;
export const CompanySchema = SchemaFactory.createForClass(Company);
