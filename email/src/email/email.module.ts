// src/email/email.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailHistory, EmailHistorySchema } from './schemas/email-history.schema';
import { EmailService } from './services/email.services';
import { EmailController } from './controllers/email.controller';
import { ConfigurationModule } from 'src/config/config.module';
import { MessageTemplate, MessageTemplateSchema } from 'src/config/schemas/template.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailHistory.name, schema: EmailHistorySchema },
      { name: MessageTemplate.name, schema: MessageTemplateSchema },
    ]),
    ConfigurationModule ],
  providers: [EmailService],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}
