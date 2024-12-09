import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FormModule } from './module/form.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule global, accessible in any module
      envFilePath: '.env', // Optional, defaults to .env in the root directory
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    FormModule,
    ClientsModule.register([
      {
        name: 'FORM_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port:Number(`${process.env.FORMS_PORT_INTERNAL}`) },
      }
    ])
  ]
})
export class AppModule {}
