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
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [   
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule global, accessible in any module
      envFilePath: '.env', // Optional, defaults to .env in the root directory
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    ClientsModule.register([
      {
        name: 'EMAIL_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: Number(`${process.env.EMAIL_PORT_INTERNAL}`) },
      }
    ]),
   EmailModule, ConfigurationModule, RetryEmailModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
