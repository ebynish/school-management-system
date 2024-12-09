import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    NotFoundException,
  } from '@nestjs/common';
  import { ApprovalRuleService } from '../services/approval-rule.service';
  
  @Controller('approval-rules')
  export class ApprovalRuleController {
    constructor(private readonly approvalRuleService: ApprovalRuleService) {}
  
    // Create a new approval rule
    @Post()
    async createApprovalRule(@Body() createRuleDto: any) {
      return await this.approvalRuleService.createRule(createRuleDto);
    }
  
    // Get all approval rules
    @Get()
    async getAllApprovalRules() {
      return await this.approvalRuleService.getAllRules();
    }
  
    // Get an approval rule by ID
    @Get(':id')
    async getApprovalRuleById(@Param('id') id: string) {
      const rule = await this.approvalRuleService.getRuleById(id);
      if (!rule) {
        throw new NotFoundException('Approval rule not found');
      }
      return rule;
    }
  
    // Update an approval rule
    @Put(':id')
    async updateApprovalRule(@Param('id') id: string, @Body() updateRuleDto: any) {
      return await this.approvalRuleService.updateRule(id, updateRuleDto);
    }
  
    // Delete an approval rule
    @Delete(':id')
    async deleteApprovalRule(@Param('id') id: string) {
      return await this.approvalRuleService.deleteRule(id);
    }
  }
  