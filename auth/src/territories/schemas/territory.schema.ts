import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Territory {
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: Types.ObjectId, required: true })
  subsidiary: Types.ObjectId;
  @Prop({ type: String })
  type: string;
}

export type TerritoryDocument = Territory & Document;
export const TerritorySchema = SchemaFactory.createForClass(Territory);
