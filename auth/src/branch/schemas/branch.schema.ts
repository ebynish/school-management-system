import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

export class Branch {
  @Prop({ type: String, required: true })
  name: string;
  
  @Prop({ type: Types.ObjectId, required: true })
  territory: Types.ObjectId;
}

export type BranchDocument = Branch & Document;
export const BranchSchema = SchemaFactory.createForClass(Branch);
