// src/email/cron/retry-emails.cron.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailService } from '../../services/email.services';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailHistory, EmailHistoryDocument } from 'src/email/schemas/email-history.schema';

@Injectable()
export class RetryEmailsCron {
  constructor(
    @InjectModel(EmailHistory.name) private emailHistoryModel: Model<EmailHistoryDocument>,
    private readonly emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES, { name: 'Every 30 Minutes', timeZone: 'Africa/Lagos' }) // Adjust the schedule as needed
  async handleCrons(){
    
    await this.retryFailedEmails();
  }

  
  // @Cron("0 0-23/2 * * *", { name: 'Every Hour', timeZone: 'Africa/Lagos' }) // Adjust the schedule as needed
  // async handleCron(){
    
  //   await this.retryFailedEmails();
  // }


  async retryFailedEmails() {
    const failedEmails = await this.emailService.failedMessages();
    
    for (const email of failedEmails) {
        let retries = email.retries;
     
        try {
          
          if (email.templateVariables){
            let response = await this.emailService.sendEmail2(email.to, email.templateType, email.templateVariables, email._id);
            
          }
          else {
            await this.emailService.sendRetry(email._id, email.to, email.subject, email.html);
            retries++;
            await this.emailHistoryModel.updateOne({  _id: email._id},  {
              $set: { retries: retries}})
          }
        } catch (error) {
          // If retry fails, update the retry count and save to the database
          retries++;
          await this.emailHistoryModel.updateOne({  _id: email._id},  {
            $set: { retries: retries}})
        }
      
    }
  }
}
