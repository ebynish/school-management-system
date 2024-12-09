import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ApprovalWorkflow extends Document {
  @Prop({ type: Types.ObjectId, required: true})
  applicationId: Types.ObjectId;

  @Prop()
  applicationType: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'ApprovalRule' })
  ruleId: Types.ObjectId;

  @Prop({ required: true })
  currentStageIndex: number;

  @Prop({ type: [{ type: Object }] })
  stages: ApprovalStageStatus[];

  @Prop({ default: 'Pending' })
  overallStatus: string;
}

export class ApprovalStageStatus {
  @Prop({ required: true })
  stageName: string;

  @Prop({ default: 'Pending' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  approvedBy: Types.ObjectId;

  @Prop({ type: Date, required: false })
  approvedAt: Date;

  @Prop({ type: String, required: false })
  notes: string;
}

export const ApprovalWorkflowSchema = SchemaFactory.createForClass(ApprovalWorkflow);
