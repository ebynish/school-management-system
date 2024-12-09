import { Module } from '@nestjs/common';
import { FormClientController } from './controllers/form.controller'
import { FormClientService } from './services/form.service';


@Module({
  imports: [],
  controllers: [FormClientController],
  providers: [FormClientService],
})
export class FormModule {}
