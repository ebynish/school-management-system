import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { ApprovalWorkflow } from '../schemas/approval-workflow.schema';
import { ApprovalRuleService } from './approval-rule.service';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuditService } from './audit.service';
import { FormService } from './form.service';
import { Form } from 'src/schemas/form.schema';

@Injectable()
export class ApprovalWorkflowService {
    private client: ClientProxy;
    private clientEmail: ClientProxy;
  constructor(
    @InjectModel(ApprovalWorkflow.name) private readonly workflowModel: Model<ApprovalWorkflow>,
    private readonly approvalRuleService: ApprovalRuleService,
    @InjectModel(Form.name)private readonly formModel: Model<Form>,
    private auditService: AuditService, // Inject AuditService
  ) {

    this.clientEmail = ClientProxyFactory.create({
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3222 }, // Adjust host and port as necessary
      });
      this.client = ClientProxyFactory.create({
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3002 },
      });
  }

  async startWorkflow(applicationId: any, ruleId: any):Promise<any> {
    try {
      const rule = await this.approvalRuleService.getRuleById(ruleId);

      const form = await this.formModel.findOne({ _id: rule.formId});
      
      const stages = rule.stages.map((stage: any) => ({
        stageName: stage.stageName,
        status: 'Pending',
        approvedBy: null,
        approvedAt: null,
        notes: null,
      }));
    
      const newWorkflow = new this.workflowModel({
        applicationId: new mongoose.Types.ObjectId(applicationId),
        applicationType: form?.schema?.toUpperCase(),
        ruleId: new mongoose.Types.ObjectId(ruleId),
        currentStageIndex: 0,
        stages,
        overallStatus: 'Pending',
      });
    
      console.log('Workflow Object:', newWorkflow);
      await newWorkflow.save();
      console.log('Workflow saved successfully!');
    } catch (e) {
      console.error('Error saving workflow:', e.message);
      console.error(e);
    }
    
  }

  async getWorkflowById(id: string):Promise<any> {
    const workflow = await this.workflowModel.findById(id).exec();
    if (!workflow) {
      throw new NotFoundException('Approval workflow not found');
    }
    return workflow;
  }

  async updateStageStatus(
    workflowId: any,
    status: string,
    approvedBy: any,
    notes: string,
    applicationId: any
  ) {

    let user = await this.getUser(approvedBy)
    const canApprove = await this.canUserApproveStage(workflowId, user, applicationId);
  
    if (!canApprove) {
      throw new Error('User does not have permission or conditions are not met for this stage approval');
    }
  
    // Proceed with stage update logic if the user has permission and conditions are met
    const workflow = await this.getWorkflowById(workflowId);
    const stage = workflow.stages[workflow.currentStageIndex];
  
    stage.status = status;
    stage.approvedBy = approvedBy;
    stage.approvedAt = new Date();
    stage.notes = notes;
  
    // Update overall status if it's the last stage
    if (workflow.currentStageIndex === workflow.stages.length - 1 && status === 'Approved') {
      workflow.overallStatus = 'Approved';
    } else if (status === 'Rejected') {
      workflow.overallStatus = 'Rejected';
    }
  
    await workflow.save();
    return workflow;
  }
  
  

  async deleteWorkflow(id: string) {
    const result = await this.workflowModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Approval workflow not found');
    }
    return result;
  }
  async canUserApproveStage(
    workflowId: string,
    user: any,
    applicationData: any
  ): Promise<boolean> {
    const workflow = await this.getWorkflowById(workflowId);
    const rule = await this.approvalRuleService.getRuleById(workflow.ruleId);
    const currentStage = rule.stages[workflow.currentStageIndex];
  
    const roleList = currentStage.roleNames;
    // Permission Checks
    console.log(roleList)
    const isRoleMatch = roleList.some((id:any) => id.toString() === user.role._id);
    
    console.log(isRoleMatch, "hehe")
    const isBranchMatch = user.branch === applicationData.submittedData?.['branch'];
    const isCommitteeMember = currentStage.committeeMembers?.includes(user._id.toString());
  
    // Condition Check (e.g., minimum amount, specific field values, etc.)
    const areConditionsMet = this.checkStageConditions(currentStage, applicationData);
  
    // Committee-based approval
    if (currentStage.approvalType === 'committee' && isCommitteeMember && areConditionsMet) {
      return true;
    }
  
    // Role-based approval
    if (currentStage.approvalType === 'role' && isRoleMatch && isBranchMatch && areConditionsMet) {
      return true;
    }
  
    // Default to false if no condition is met
    return false;
  }
  
  private checkStageConditions(currentStage: any, applicationData: any): boolean {
    const conditions = currentStage.conditions || [];
  
    // Iterate through each condition and verify it against the application data
    for (const condition of conditions) {
      const { field, operator, value } = condition;
      const applicationValue = applicationData?.[field];
  
      // Check based on the operator
      switch (operator) {
        case 'equals':
          if (applicationValue !== value) return false;
          break;
        case 'notEquals':
          if (applicationValue === value) return false;
          break;
        case 'greaterThan':
          if (applicationValue <= value) return false;
          break;
        case 'lessThan':
          if (applicationValue >= value) return false;
          break;
        case 'includes':
          if (!Array.isArray(applicationValue) || !applicationValue.includes(value)) return false;
          break;
        default:
          break
      }
    }
  
    // Return true if all conditions are met
    return true;
  }
  async getUser(userId: any) {
    return await firstValueFrom(this.client.send({ cmd: 'find-user' }, userId));
  }

  async getCommitteeMemberEmails(committeeMembers: any): Promise<any> {
    const committeeEmails = await Promise.all(
      committeeMembers.map(async (userId: any) => {
        const user = await this.getUser(userId);
        return user?.email;
      })
    );
    return committeeEmails.filter(Boolean).join(", ");
  }
  async sendMail(email: any, message: any) {
      
      
    let emailMessage = {
      to: email,
      templateType: 'notification',
      templateVariables: { action: message },
      type: 'notification',
    };
    await firstValueFrom(this.clientEmail.send({ cmd: 'send-email' }, emailMessage));
  
}
async getPendingWorkflowsForUser(user: any): Promise<any[]> {
  // Step 1: Fetch all workflows with a 'Pending' status in the current stage
  const pendingWorkflows = await this.workflowModel.find({
    overallStatus: 'Pending',
    'stages.status': 'Pending',
  }).populate("applicationId").exec();

  
  // Step 2: Filter workflows based on the user's role and committee membership
  const approvableWorkflows = [];

  for (const workflow of pendingWorkflows) {
    const rule = await this.approvalRuleService.getRuleById(workflow.ruleId);
    const currentStageIndex = workflow.currentStageIndex;
    const currentStage = rule.stages[currentStageIndex];
    
    const roleId = user?.role?._id;
    const roleList = currentStage.roleNames;
    
    const isRoleMatch =  roleList.some((id:any) => id.toString() === roleId);
    
    // Check committee-based approval
    const isCommitteeMember = currentStage.committeeMembers?.includes(user._id.toString());

    // Add the workflow to the list if the user can approve based on role or committee membership
    if (isRoleMatch || isCommitteeMember) {
      approvableWorkflows.push(workflow);
    }
  }

  return approvableWorkflows;
}
  async getApprovalList(userId: any):Promise<any>{
    const user = await this.getUser(userId);
    // console.log(user)
    const approvableWorkflows = await this.getPendingWorkflowsForUser(user);
    return approvableWorkflows
  }


}
