import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ApprovalRule extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [{ type: Object }] })
  stages: ApprovalStage[];

  @Prop({ default: 1 })
  requiredConsensus: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Form' }] })
  formId: Types.ObjectId[];
}

export class ApprovalStage {
  @Prop({ required: true })
  stageName: string;

  @Prop({ required: true })
  approvalType: string;

  @Prop({ type: [String], required: false })
  roleNames: string[];

  @Prop({ type: [Types.ObjectId], ref: 'User', required: false })
  committeeMembers: Types.ObjectId[];

  @Prop({ required: false })
  requiredApprovals: number;

  @Prop({ required: false })
  branchId: string;

  @Prop({ type: Object, required: false })
  conditions: Record<string, any>;
}

export const ApprovalRuleSchema = SchemaFactory.createForClass(ApprovalRule);
