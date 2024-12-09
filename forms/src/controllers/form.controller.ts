// src/auth/auth.controller.ts
import { Controller, Post, Body, Req, UnauthorizedException } from '@nestjs/common';

import { MessagePattern, Payload } from '@nestjs/microservices';
import { IntegrationsService } from 'src/integrations/services/integration.service';
import { FormService } from 'src/services/form.service';

@Controller('forms')
export class FormClientController {
  constructor(private formService: FormService,
    private integrationService: IntegrationsService) {}


  @MessagePattern({ cmd: 'create-form' })
  async create(@Payload() data: any) {
    
    const form = await this.formService.create(data)
    
    return form
  }

  @MessagePattern({ cmd: 'submit-form' })
  async submit(@Payload() data: any) {
    
    const form = await this.formService.submitForm(data?.data, data?.userId)
    
    return form
  }
 
  @MessagePattern({ cmd: 'get-forms' })
  async getForms(@Payload() data: any) {
    const form = await this.formService.findAll(data?.page, Number(data?.limit), data?.searchText);
    return form
  }

  @MessagePattern({ cmd: 'get-table' })
  async getTable(@Payload() data: any) {
    
    const form = await this.formService.findTable(data.type, data?.page, Number(data?.limit), data?.searchText, data?.id, data?.mode, data?.populate);
    return form
  }
  @MessagePattern({ cmd: 'get-table-status' })
  async getTableByStatus(@Payload() data: any) {
    
    const form = await this.formService.findTableByStatus(data.type, data?.page, Number(data?.limit), data?.searchText, data?.status, data?.id, data?.mode, data?.populate);
    return form
  }
  

  @MessagePattern({ cmd: 'get-form' })
  async getFormById(@Payload() data: any) {
    let form = await this.formService.findById(data?.id)
    return form
  }
  @MessagePattern({ cmd: 'get-data' })
  async getData(@Payload() data: any) {
    let form = await this.formService.findData(data?.schema, data?.id, data?.type, data?.status)
    
    return form
  }
  @MessagePattern({ cmd: 'get-form-slug' })
  async getFormBySlug(@Payload() data: any) {
    
    let form = await this.formService.findBySlug(data?.id)
    return form
  }

  @MessagePattern({ cmd: 'get-summary' })
  async getSummary(@Payload() data: any) {
    const form = await this.formService.getSummary(data)
    return form
  }

  @MessagePattern({ cmd: 'update-schema' })
  async updateSchema(@Payload() data: any) {
    const form = await this.formService.updateSchema(data)
    return form
  }

  @MessagePattern({ cmd: 'generate-invoice' })
  async generateInvoice(@Payload() data: any) {
    const form = await this.integrationService.checkAndGenerateInvoice(data);
    return form
  }

 
}
