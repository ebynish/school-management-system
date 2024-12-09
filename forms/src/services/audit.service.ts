import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditTrail, AuditTrailDocument } from '../schemas/audit.schema';

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditTrail.name) private auditModel: Model<AuditTrailDocument>,
  ) {}

  async logAction(
    action: string,
    userId: string,
    resourceId: string,
    resourceType: string,
    previousState: Record<string, any>,
    newState: Record<string, any>,
  ) {
    const auditEntry = new this.auditModel({
      action,
      userId,
      resourceId,
      resourceType,
      previousState,
      newState,
    });
    await auditEntry.save();
  }
}
