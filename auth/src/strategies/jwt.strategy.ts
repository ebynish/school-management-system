// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserService } from 'src/users/services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET, // Make sure to set this in your environment variables
    });
  }

  async validate(payload: JwtPayload, done: VerifiedCallback) {
    const user = await this.userService.findOne(payload.sub); // Payload.sub typically contains user ID
    if (!user) {
      return done(new Error('User not found'), false);
    }
    done(null, user);
  }
}
