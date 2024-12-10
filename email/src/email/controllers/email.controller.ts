// src/email/controllers/email.controller.ts
import { Controller } from '@nestjs/common';
import { EmailService } from '../services/email.services';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class EmailController {
  constructor(
  private readonly emailService: EmailService) {}



  @MessagePattern({ cmd: 'notification' })
  async handleMessage(@Payload() message: any): Promise<any> {
   
    await this.emailService.sendEmail(
      message?.data?.email,
      message?.data?.type,
      message.data,
    );
    return { statusCode: 200, message: 'Successful'}
  }


  // @Post('send')
  // async sendEmail(@Body() sendEmailDto: any): Promise<void> {
  //   // this.kafka.handleMessage()
  //   // Use the microservice to send the email
  //   // await this.clientProxy.send<void>('send_email', sendEmailDto).toPromise();
  // }

  // @Post('send-local')
  // async sendEmailLocally(@Body() sendEmailDto: any): Promise<void> {
  //   // Send the email locally using the EmailService
  //   await this.emailService.sendEmail(
  //     sendEmailDto.to,
  //     sendEmailDto.templateType,
  //     sendEmailDto.templateVariables,
  //   );
  // }
}
