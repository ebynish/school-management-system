import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './users/user.module';
import { RoleModule } from './roles/role.module';
import { FormModule } from './forms/form.module';
import { MenuModule } from './menu/menu.module';
import { PageModule } from './pages/page.module';
import { PageClientService } from './pages/services/page.service';
import { FormClientService } from './forms/services/form.service';
import { PermissionModule } from './permissions/permission.module';
import { ConfigService } from './config/services/config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Config, ConfigSchema } from './config/schemas/config.schema';
import { AuthClientService } from './auth/services/auth.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule global, accessible in any module
      envFilePath: '.env', // Optional, defaults to .env in the root directory
    }),
    MongooseModule.forRoot(process.env.MONGO_URI), // Replace with your MongoDB URI
    MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
    JwtModule.register({
    secret: 'OK1', // Replace with environment variable in production
    signOptions: { expiresIn: '1h' },
  }), FormModule, AuthModule, UserModule, RoleModule,  MenuModule, PageModule, PermissionModule],
  controllers: [AppController],
  providers: [AppService, PageClientService, FormClientService, ConfigService, AuthClientService],
})
export class AppModule {}
