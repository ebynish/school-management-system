import { Module } from '@nestjs/common';
import { PermissionClientController } from './controllers/permission.controller'
import { PermissionClientService } from './services/permission.service';


@Module({
  imports: [],
  controllers: [PermissionClientController],
  providers: [PermissionClientService],
})
export class PermissionModule {}
