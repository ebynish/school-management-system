import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { Menu, MenuSchema } from './schemas/menu.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule global, accessible in any module
      envFilePath: '.env', // Optional, defaults to .env in the root directory
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
  MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }]),
  ClientsModule.register([
  {
    name: 'MENU_SERVICE',
    transport: Transport.TCP,
    options: { host: 'localhost', port: Number(`${process.env.MENU_PORT_INTERNAL}`) },
    },
  ])
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
