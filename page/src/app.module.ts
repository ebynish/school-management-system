import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Page, PageSchema } from './schemas/page.schema';
import { PageService } from './services/page.service';
import { PageController } from './controllers/page.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule global, accessible in any module
      envFilePath: '.env', // Optional, defaults to .env in the root directory
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }]),
    ClientsModule.register([
      {
        name: 'PAGE_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: Number(`${process.env.PAGES_PORT_INTERNAL}`) },
        },
      ])
  ],
  providers: [PageService],
  controllers: [PageController]
})
export class AppModule {}
