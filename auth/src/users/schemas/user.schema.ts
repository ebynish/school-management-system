import { Schema, Document, Types } from 'mongoose';
import { Prop, Schema as MongooseSchema, SchemaFactory } from '@nestjs/mongoose';
export type UserDocument = User & Document;

@MongooseSchema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({})
  otherName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Types.ObjectId, ref:'Role'})
  role: Types.ObjectId;

  @Prop({type: Types.ObjectId, ref:'Branch'})
  branch: Types.ObjectId;

  @Prop({ref:'Level'})
  level: Types.ObjectId;

  @Prop()
  avatarUrl: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  resetPasswordToken: string
  
  @Prop()
  resetPasswordExpires: Date

}

export const UserSchema = SchemaFactory.createForClass(User);
