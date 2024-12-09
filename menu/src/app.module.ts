import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { Menu, MenuSchema } from './schemas/menu.schema';

@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017/school'),
  MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }]),
  ClientsModule.register([
  {
    name: 'MENU_SERVICE',
    transport: Transport.TCP,
    options: { host: 'localhost', port: 3011 },
    },
  ])
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
