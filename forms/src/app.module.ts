import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FormModule } from './module/form.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/school'),
    FormModule,
    ClientsModule.register([
      {
        name: 'FORM_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3010 },
      }
    ])
  ]
})
export class AppModule {}
