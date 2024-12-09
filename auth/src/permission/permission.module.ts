// permissions/permissions.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionsController } from './controllers/permission.controller';
import { PermissionService } from './services/permission.service';
import { Permission, PermissionSchema } from './schemas/permission.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema }])],
  controllers: [PermissionsController],
  exports: [PermissionService],
  providers: [PermissionService],
})
export class PermissionsModule {}
