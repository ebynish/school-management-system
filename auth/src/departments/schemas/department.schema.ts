import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Department {
  @Prop({ type: String, required: true })
  name: string;
  
}

export type DepartmentDocument = Department & Document;
export const DepartmentSchema = SchemaFactory.createForClass(Department);
