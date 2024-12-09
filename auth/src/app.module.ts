import { Module } from '@nestjs/common';
import { AuthController } from './app.controller';
import { AuthService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserService } from './users/services/user.service';
import { UserController } from './users/controllers/user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { RolesController } from './roles/controllers/role.controller';
import { RolesService } from './roles/services/role.service';
import { Role, RoleSchema } from './roles/schemas/role.schema';
import { PermissionService } from './permission/services/permission.service';
import { RoleModule } from './roles/role.module';
import { PermissionsModule } from './permission/permission.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/school'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'OK1', // Replace with environment variable in production
      signOptions: { expiresIn: '1h' },
    }),
    ClientsModule.register([
    {
      name: 'AUTH_SERVICE',
      transport: Transport.TCP,
      options: { host: 'localhost', port: 3002 },
    }
  ]),RoleModule, PermissionsModule],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService],
})
export class AppModule {}
