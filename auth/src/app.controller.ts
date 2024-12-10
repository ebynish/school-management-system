// src/auth/auth.controller.ts
import { Controller, Post, Body, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './users/services/user.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}


  @MessagePattern({ cmd: 'login' })
  async login(@Payload() loginDto: any) {
    
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);
    
    
    if (!user) {
      return { statusCode: 401, message:'Invalid credentials'};
    }
    return await this.authService.login(user);
  }
 
  @MessagePattern({ cmd: 'register' })
  async register(@Payload() createUserDto: any) {
    const user = await this.authService.register(createUserDto);
    return user
  }


  @MessagePattern({ cmd: 'change_password' })
  async mop(@Payload() data: any) {
    const user = await this.authService.changePassword(data)
    return user
  }
  @MessagePattern({ cmd: 'forgot-password' })
  async xfp(@Payload() data: any) {
    const user = await this.authService.forgotPassword(data.email)
    return user
  }
  @MessagePattern({ cmd: 'reset-password' })
  async xfps(@Payload() data: any) {
    const user = await this.authService.resetPassword(data)
    return user
  }

 
}
