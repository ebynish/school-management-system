// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private client: ClientProxy;
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "OK1", // Make sure to set this in your environment variables
    });
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'localhost', port: 3002 }, // Adjust host and port as necessary
    });
  }

  async validate(payload: JwtPayload, done: VerifiedCallback) {
    
    const user = await firstValueFrom(this.client.send({ cmd: 'find-user' }, payload.sub))
    
    if (!user) {
      return done(new Error('User not found'), false);
    }
    done(null, user);
  }
}
