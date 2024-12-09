import {
    Controller,
    Get,
    Post,
    Put,
    Param,
    Body,
    NotFoundException,
    Query,
    Delete,
  } from '@nestjs/common';
  import { ApprovalWorkflowService } from '../services/approval-workflow.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
  
  @Controller('approval-workflows')
  export class ApprovalWorkflowController {
    constructor(private readonly workflowService: ApprovalWorkflowService) {}
  
    // Start a new approval workflow
    // @Post('start')
    // async startWorkflow(@Body() startDto: { applicationId: string; ruleId: string }) {
    //   const { applicationId, ruleId } = startDto;
    //   return await this.workflowService.startWorkflow(applicationId, ruleId);
    // }
  
    @MessagePattern({ cmd: 'get-user-flow' })
    async getUser(@Payload() payload:any) {

      return await this.workflowService.getApprovalList(payload?.userId);
    }
    // Get a specific approval workflow by ID
    @Get(':id')
    async getWorkflowById(@Param('id') id: string) {
      const workflow = await this.workflowService.getWorkflowById(id);
      if (!workflow) {
        throw new NotFoundException('Approval workflow not found');
      }
      return workflow;
    }
  
    // Update the status of a stage in the approval workflow
    @MessagePattern({ cmd: 'update-stage' })
    async updateStageStatus(
      @Payload() payload:any
    ) {
      const { workflowId, stageIndex, status, userId, notes} = payload;
      return await this.workflowService.updateStageStatus(
        workflowId,
        status,
        userId,
        notes,
        payload
      );
    }
  
    // Delete an approval workflow
    @Delete(':id')
    async deleteWorkflow(@Param('id') id: string) {
      return await this.workflowService.deleteWorkflow(id);
    }
  
    // Check if a user can approve the current stage
    @MessagePattern({ cmd: 'can-approve' })
    async canUserApproveStage(
      @Param('id') workflowId: string,
      @Param('stageIndex') stageIndex: number,
      @Query('userId') userId: string,
      @Query('applicationData') applicationData: any
    ) {
      return await this.workflowService.canUserApproveStage(
        workflowId,
        userId, // Assuming user object only contains userId
        applicationData
      );
    }
  }
  