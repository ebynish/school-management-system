import { Module } from '@nestjs/common';
import { PageClientController } from './controllers/page.controller'
import { PageClientService } from './services/page.service';


@Module({
  imports: [],
  controllers: [PageClientController],
  providers: [PageClientService],
})
export class PageModule {}
