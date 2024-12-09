import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Page, PageSchema } from './schemas/page.schema';
import { PageService } from './services/page.service';
import { PageController } from './controllers/page.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/school'),
    MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }]),
    ClientsModule.register([
      {
        name: 'PAGE_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3013 },
        },
      ])
  ],
  providers: [PageService],
  controllers: [PageController]
})
export class AppModule {}
