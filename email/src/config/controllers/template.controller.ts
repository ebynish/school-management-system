// src/config/controllers/message-template.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MessageTemplateService } from '../services/template.services';
import { MessageTemplate } from '../schemas/template.schema';

@Controller('templates')
export class MessageTemplateController {
  constructor(private readonly messageTemplateService: MessageTemplateService) {}

  @Get()
  async findAll(): Promise<MessageTemplate[]> {
    return this.messageTemplateService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<MessageTemplate> {
    return this.messageTemplateService.findById(id);
  }

  @Post()
  async create(@Body() messageTemplate: Partial<MessageTemplate>): Promise<MessageTemplate> {
    return this.messageTemplateService.create(messageTemplate);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() messageTemplate: Partial<MessageTemplate>): Promise<MessageTemplate> {
    return this.messageTemplateService.update(id, messageTemplate);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.messageTemplateService.delete(id);
  }
}
