import { Module } from '@nestjs/common';
import { MenuClientController } from './controllers/menu.controller'
import { MenuClientService } from './services/menu.service';


@Module({
  imports: [],
  controllers: [MenuClientController],
  providers: [MenuClientService],
})
export class MenuModule {}
