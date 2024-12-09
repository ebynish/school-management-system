  import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
  import { InjectConnection, InjectModel } from "@nestjs/mongoose";
  import { Model, Types, Connection } from "mongoose";
  import { ApprovalRule } from "src/schemas/approval-rule.schema";
  import { AuditService } from "./audit.service"; // Import AuditService
  import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
  import { firstValueFrom } from 'rxjs';
  import { Form, FormDocument } from "src/schemas/form.schema";
  
  @Injectable()
  export class ApprovalRuleService {
    
  
    constructor(
      @InjectModel(ApprovalRule.name) private approvalRuleModel: Model<ApprovalRule>,
      @InjectModel(Form.name) private readonly formModel: Model<FormDocument>,
      @InjectConnection() private connection: Connection,
      private auditService: AuditService, // Inject AuditService
      
    ) {  }
  
      // Create a new approval rule
      async createRule(createRuleDto: any): Promise<ApprovalRule> {
        const newRule = new this.approvalRuleModel(createRuleDto);
        return await newRule.save();
      }

      // Get all approval rules
      async getAllRules(): Promise<ApprovalRule[]> {
        return await this.approvalRuleModel.find().exec();
      }   
    async getRuleById(id: any):Promise<any> {
      const rule = await this.approvalRuleModel.findById(id).exec();
      if (!rule) {
        throw new NotFoundException('Approval rule not found');
      }
      return rule;
    }
    async getRuleByFormId(id: any):Promise<any> {
      const rule = await this.approvalRuleModel.findOne({ formId: new Types.ObjectId(id)}).exec();
      if (!rule) {
        throw new NotFoundException('Approval rule not found');
      }
      return rule;
    }
    // Update an approval rule
  async updateRule(id: string, updateRuleDto: any): Promise<ApprovalRule> {
    const updatedRule = await this.approvalRuleModel.findByIdAndUpdate(id, updateRuleDto, {
      new: true,
    }).exec();
    if (!updatedRule) {
      throw new NotFoundException('Approval rule not found');
    }
    return updatedRule;
  }

  // Delete an approval rule
  async deleteRule(id: string): Promise<ApprovalRule> {
    const result = await this.approvalRuleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Approval rule not found');
    }
    return result;
  }

  }
  

  

