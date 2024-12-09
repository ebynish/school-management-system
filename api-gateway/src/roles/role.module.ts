import { Module } from '@nestjs/common';
import { RoleClientController } from './controllers/role.controller'
import { RoleClientService } from './services/role.service';


@Module({
  imports: [],
  controllers: [RoleClientController],
  providers: [RoleClientService],
})
export class RoleModule {}
