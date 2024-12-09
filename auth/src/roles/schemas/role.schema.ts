import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose'; // Import mongoose.Types
import { PermissionDocument } from 'src/permission/schemas/permission.schema';

@Schema({
  timestamps: true,
})
export class Role {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String})
  description: string

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Permission' }] })
  permissions: PermissionDocument[];
  
}

export type RoleDocument = Role & Document;
export const RoleSchema = SchemaFactory.createForClass(Role);
