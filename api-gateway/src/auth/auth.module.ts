import { Module } from '@nestjs/common';
import { AuthClientController } from './controllers/auth.controller'
import { AuthClientService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [],
  controllers: [AuthClientController],
  providers: [AuthClientService, JwtStrategy],
})
export class AuthModule {}
