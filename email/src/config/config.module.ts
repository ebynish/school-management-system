// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigurationService } from './services/config.services';
import { ConfigurationController } from './controllers/config.controller';
import { MessageTemplate, MessageTemplateSchema } from './schemas/template.schema';
import { MessageTemplateController } from './controllers/template.controller';
import { MessageTemplateService } from './services/template.services';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MessageTemplate.name, schema: MessageTemplateSchema }]),
  ],
  providers: [ConfigurationService, MessageTemplateService],
  controllers: [ConfigurationController, MessageTemplateController],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
