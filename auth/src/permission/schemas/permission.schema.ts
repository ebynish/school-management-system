// permissions/schemas/permission.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Permission {

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

export type PermissionDocument = Permission & Document; // Export the PermissionDocument type

export const PermissionSchema = SchemaFactory.createForClass(Permission);
