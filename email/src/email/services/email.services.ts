// src/shared/email/email.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigurationService } from '../../config/services/config.services';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import mongoose, { Model, Connection } from 'mongoose';
import { EmailHistory, EmailHistoryDocument } from '../schemas/email-history.schema';

@Injectable()
export class EmailService implements OnModuleInit {
  private transporter: nodemailer.Transporter;
  private isTransporterConnected: boolean = false;
  private connectionRetryInterval: number = 1200000; // Retry interval in milliseconds
 
  constructor(
    @InjectConnection() private connection: Connection,
    private configurationService: ConfigurationService,
    @InjectModel(EmailHistory.name) private emailHistoryModel: Model<EmailHistoryDocument>

  ) {

  }

  async onModuleInit() {
    await this.connectTransporter(); // Connect the transporter when the module is initialized
    // this.processPendingEmails(); // Process pending emails after the transporter is connected
  
  }

  private async connectTransporter(): Promise<void> {
    try {
      const configFromDB = await this.configurationService.getConfiguration();

      if (configFromDB) {
        this.transporter = nodemailer.createTransport({
          host: configFromDB.notification.smtpHost,
          port: configFromDB.notification.smtpPort,
          secure: configFromDB.notification.smtpSecure,
          auth: {
            user: configFromDB.notification.smtpUser,
            pass: configFromDB.notification.smtpPass,
          },
          tls: {
            minVersion: 'TLSv1.2' // Set to 'TLSv1.2' or 'TLSv1.3' if supported by your server
          }
        });

        // Check if the transporter is connected
        this.transporter.verify((error) => {
          if (error) {
            console.error('Failed to connect the email transporter:', error);
            this.isTransporterConnected = false;
            this.scheduleTransporterConnectionRetry();
          } else {
            console.log('Email transporter connected successfully');
            this.isTransporterConnected = true;
            // this.processPendingEmails(); // Process pending emails after the transporter is connected
          }
        });
      }
    } catch (error) {
      console.error('Failed to connect the email transporter:', error);
      this.isTransporterConnected = false;
      this.scheduleTransporterConnectionRetry();
    }
  }

  private scheduleTransporterConnectionRetry(attempt: number = 1): void {
    const maxRetries = 5;
    const maxInterval = 1200000; // 1 minute
    const retryInterval = Math.min(this.connectionRetryInterval * Math.pow(2, attempt - 1), maxInterval);
  
    setTimeout(async () => {
      console.log('Retrying email transporter connection (attempt ' + attempt + ')...');
      await this.connectTransporter();
    }, retryInterval);
  }
  

 

  async sendEmail(to: string, templateType: string, templateVariables: any): Promise<void> {
    if (!this.isTransporterConnected) {
        await this.saveEmailHistoryOffline(to, templateType, templateVariables); // Log the email in the database
      return; // Exit the method without throwing an error
    }
     
    const configFromDB = await this.configurationService.getConfiguration();
    
    templateVariables.logo = configFromDB?.logoUrl;
    templateVariables.schoolName = configFromDB?.siteTitle;
    
    const matchingFields = Object?.keys(templateVariables)?.filter((key) =>{
        if (key.toLowerCase().includes('link'))
          templateVariables[`${key}`] = `${configFromDB.website}${templateVariables[`${key}`]}`;
      
      });
 
    // Find the message template based on the templateType
    const messageTemplate = await this.connection.collection("templates").findOne({ type: templateType });

    if (!messageTemplate) {
      throw new Error(`Message template with type "${templateType}" not found.`);
    }

    // Replace template variables in the content
let content = `${configFromDB.header}${messageTemplate.content}${configFromDB.footer}`;
let subject = messageTemplate.subject;

Object.keys(templateVariables).forEach((key) => {
  const value = templateVariables[key];
  const regex = new RegExp(`#{${key}}`, 'g');

  if (Array.isArray(value)) {
    // Handle array of objects
    let customListContent = '';
    value.forEach((item, index) => {
      Object.keys(item).forEach((itemKey) => {
        const itemRegex = new RegExp(`#{${key}\\[${index}\\].${itemKey}}`, 'g');
        content = content.replace(itemRegex, item[itemKey]);
        subject = subject.replace(itemRegex, item[itemKey]);
      });

      // Generate custom list content with dynamic keys
      customListContent += `<tr>`;
      Object.keys(item).forEach((itemKey) => {
        const dynamicKey = `#{${key}[${index}].${itemKey}}`;
        customListContent += `<td style="padding: 5px; margin: 5px; border: 1px solid black">${item[itemKey]}</td>`;
        content = content.replace(dynamicKey, item[itemKey]);
        subject = subject.replace(dynamicKey, item[itemKey]);
      });
      customListContent += `</tr>`;
    });

    // Replace the placeholder for the custom list table in the content
    const customListTableRegex = new RegExp(`#{${key}}`, 'g');
    content = content.replace(customListTableRegex, customListContent);
  } else {
    // Handle regular string replacement
    content = content.replace(regex, value);
    subject = subject.replace(regex, value);
  }
});
    let newDate = new Date();
    let yearCurr = newDate.getFullYear();
    content = content.replace(new RegExp(`#{date}`, 'g'), yearCurr.toString())
   
    const mailOptions: nodemailer.SendMailOptions = {
      from: configFromDB.sender, // Change to your desired email address
      to,
      subject: subject.toUpperCase(),
      html: `<html>${content}</html>`, // Add any additional content you want
    };

    try {
      await this.transporter.sendMail(mailOptions);
      await this.saveEmailHistory(mailOptions, true);
    } catch (error) {
      await this.saveEmailHistory(mailOptions, false);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
  
  async sendEmail2(to: string, templateType: string, templateVariables: any, id:any): Promise<any> {
    
    const configFromDB = await this.configurationService.getConfiguration();
  
    // Find the message template based on the templateType
    const messageTemplate = await this.connection.collection("templates").findOne({ type: templateType });

    if (!messageTemplate) {
      throw new Error(`Message template with type "${templateType}" not found.`);
    }

    // Replace template variables in the content
let content = `${configFromDB.header}${messageTemplate.content}${configFromDB.footer}`;
let subject = messageTemplate.subject;

Object.keys(templateVariables).forEach((key) => {
  const value = templateVariables[key];
  const regex = new RegExp(`#{${key}}`, 'g');

  if (Array.isArray(value)) {
    // Handle array of objects
    let customListContent = '';
    value.forEach((item, index) => {
      Object.keys(item).forEach((itemKey) => {
        const itemRegex = new RegExp(`#{${key}\\[${index}\\].${itemKey}}`, 'g');
        content = content.replace(itemRegex, item[itemKey]);
        subject = subject.replace(itemRegex, item[itemKey]);
      });

      // Generate custom list content with dynamic keys
      customListContent += `<tr>`;
      Object.keys(item).forEach((itemKey) => {
        const dynamicKey = `#{${key}[${index}].${itemKey}}`;
        customListContent += `<td style="padding: 5px; margin: 5px; border: 1px solid black">${item[itemKey]}</td>`;
        content = content.replace(dynamicKey, item[itemKey]);
        subject = subject.replace(dynamicKey, item[itemKey]);
      });
      customListContent += `</tr>`;
    });

    // Replace the placeholder for the custom list table in the content
    const customListTableRegex = new RegExp(`#{${key}}`, 'g');
    content = content.replace(customListTableRegex, customListContent);
  } else {
    // Handle regular string replacement
    content = content.replace(regex, value);
    subject = subject.replace(regex, value);
  }
});
    let newDate = new Date();
    let yearCurr = newDate.getFullYear();
    content = content.replace(new RegExp(`#{date}`, 'g'), yearCurr.toString())
   
    const mailOptions: nodemailer.SendMailOptions = {
      from: configFromDB.sender, // Change to your desired email address
      to,
      subject: subject.toUpperCase(),
      html: `<html>${content}</html>`, // Add any additional content you want
    };

    try {
      await this.emailHistoryModel.deleteOne({ _id: id})
      await this.transporter.sendMail(mailOptions);
      await this.saveEmailHistory(mailOptions, true);
      return 'success'
    } catch (error) {
      await this.saveEmailHistory(mailOptions, false);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
  async sendRetry(id: string, to: string, subject: string, html: string): Promise<void> {
    if (!this.isTransporterConnected) {
      throw new Error('Email transporter is not connected. Cannot send email at the moment.');
    }

    const configFromDB = await this.configurationService.getConfiguration();
  
    
    const mailOptions: nodemailer.SendMailOptions = {
      from: configFromDB.sender, // Change to your desired email address
      to,
      subject: subject.toUpperCase(),
      html: html
    };

    try {
      await this.transporter.sendMail(mailOptions);
      await this.updateEmailHistory(id, true);
    } catch (error) {
      // await this.saveEmailHistory(mailOptions, false);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
  private async updateEmailHistory(id: any, isSent: boolean): Promise<void> {
    try {
      await this.emailHistoryModel.updateOne(
        {

          _id: id
        },
        {
          $set: {
            isSent,
            sentAt: isSent ? new Date() : undefined,
          },
        },
      );
    } catch (error) {
      console.error('Failed to update email history:', error);
    }
  }
  private async saveEmailHistoryOffline(to: string, templateType: string, templateVariables: any): Promise<void> {
    await this.emailHistoryModel.create({
      to,
      subject: 'Email subject (offline)',
      text: 'Email text (offline)',
      html: 'Email HTML content (offline)',
      isSent: false,
      sentAt: undefined,
      retries: 0,
      templateType,
      templateVariables,
    });
  }

  private async saveEmailHistory(
    mailOptions: nodemailer.SendMailOptions,
    isSent: boolean,
    retries: number = 0,
  ): Promise<void> {
    await this.emailHistoryModel.create({
      to: mailOptions.to,
      subject: mailOptions.subject,
      text: mailOptions.text,
      html: mailOptions.html,
      isSent,
      sentAt: isSent ? new Date() : undefined,
      retries,
    });
  }
  async failedMessages(): Promise<any> {
    return this.emailHistoryModel.find({ isSent: false , retries: { $lt: 5 } }).exec();
  }  
}
