// src/config/services/message-template.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageTemplate, MessageTemplateDocument } from '../schemas/template.schema';

@Injectable()
export class MessageTemplateService {
  constructor(
    @InjectModel(MessageTemplate.name) private messageTemplateModel: Model<MessageTemplateDocument>,
  ) {}

  async findAll(): Promise<MessageTemplate[]> {
    return this.messageTemplateModel.find().exec();
  }

  async findById(id: string): Promise<MessageTemplate> {
    return this.messageTemplateModel.findById(id).exec();
  }

  async create(messageTemplate: Partial<MessageTemplate>): Promise<MessageTemplate> {
    return this.messageTemplateModel.create(messageTemplate);
  }

  async update(id: string, messageTemplate: Partial<MessageTemplate>): Promise<MessageTemplate> {
    return this.messageTemplateModel.findByIdAndUpdate(id, messageTemplate, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.messageTemplateModel.findByIdAndDelete(id).exec();
  }
}
