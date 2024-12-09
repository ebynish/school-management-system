import { Module } from '@nestjs/common';
import { AuthController } from './app.controller';
import { AuthService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserService } from './users/services/user.service';
import { UserController } from './users/controllers/user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { RoleModule } from './roles/role.module';
import { PermissionsModule } from './permission/permission.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule global, accessible in any module
      envFilePath: '.env', // Optional, defaults to .env in the root directory
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'OK1', // Replace with environment variable in production
      signOptions: { expiresIn: '1h' },
    }),
    ClientsModule.register([
    {
      name: 'AUTH_SERVICE',
      transport: Transport.TCP,
      options: { host: 'localhost', port: Number(`${process.env.AUTH_PORT_INTERNAL}`) },
    }
  ]),RoleModule, PermissionsModule],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService],
})
export class AppModule {}
