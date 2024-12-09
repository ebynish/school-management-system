// roles/role.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schemas/role.schema';
import { RolesService } from './services/role.service';
import { RolesController } from './controllers/role.controller';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { PermissionsModule } from 'src/permission/permission.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }, { name: User.name, schema: UserSchema }]),
  PermissionsModule
  ],
  providers: [RolesService],
  exports: [RolesService],
  controllers: [RolesController],
})
export class RoleModule {}
