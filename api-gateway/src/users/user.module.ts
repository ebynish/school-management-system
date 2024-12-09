import { Module } from '@nestjs/common';
import { UserClientController } from './controllers/user.controller'
import { UserClientService } from './services/user.service';


@Module({
  imports: [],
  controllers: [UserClientController],
  providers: [UserClientService],
})
export class UserModule {}
