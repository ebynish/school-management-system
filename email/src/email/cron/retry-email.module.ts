// src/email/email.module.ts
import { Module } from '@nestjs/common';
import { RetryEmailsCron } from './services/retry-emails.cron';
import { ConfigurationModule } from 'src/config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailHistory, EmailHistorySchema } from '../schemas/email-history.schema';
import { MessageTemplate, MessageTemplateSchema } from 'src/config/schemas/template.schema';
import { EmailModule } from '../email.module';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: EmailHistory.name, schema: EmailHistorySchema },
        { name: MessageTemplate.name, schema: MessageTemplateSchema }
    ]),
    ConfigurationModule,
    EmailModule
  ],
  providers: [RetryEmailsCron],
  exports: [RetryEmailsCron],
})
export class RetryEmailModule {}
