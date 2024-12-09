// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigurationModule } from './config/config.module';
import { RetryEmailModule } from './email/cron/retry-email.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [   
    ScheduleModule.forRoot(),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/school'),
    ClientsModule.register([
      {
        name: 'EMAIL_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3222 },
      }
    ]),
   EmailModule, ConfigurationModule, RetryEmailModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
