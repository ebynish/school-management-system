import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

export type AuditTrailDocument = AuditTrail & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }) // Specify custom names for timestamps
export class AuditTrail {
  @Prop({ required: true })
  action: string; // The action performed (e.g., 'CREATE', 'UPDATE', 'DELETE')
  
  @Prop({ required: true, type: Types.ObjectId }) // Use ObjectId for userId
  userId: Types.ObjectId; // The ID of the user who performed the action

  @Prop({ required: true, type: Types.ObjectId }) // Use ObjectId for resourceId
  resourceId: Types.ObjectId; // The ID of the resource being acted upon


  @Prop({ required: true })
  resourceType: string; // The type of resource (e.g., 'User', 'Product')

  @Prop({ type: Object})
  previousState: any; // The state of the resource before the change

  @Prop({ type: Object })
  newState: any; // The state of the resource after the change

  @Prop({ type: Date, default: Date.now }) // Optional: Only if you want to define it explicitly, but not necessary since timestamps are managed by Mongoose
  createdAt: Date;

  @Prop({ type: Date, default: Date.now }) // Optional: Same as above
  updatedAt: Date;
}

export const AuditTrailSchema = SchemaFactory.createForClass(AuditTrail);
