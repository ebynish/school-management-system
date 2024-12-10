import { Controller, Post, Body, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthClientService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserOne } from '../decorators/user.decorator';

@Controller('auth')
export class AuthClientController {
  constructor(private authService: AuthClientService) {}

  @Post('login')
  async login(@Body() user: any): Promise<any> {
    try {
      const result = await this.authService.login(user);
      
      return {
        statusCode: result.statusCode,
        message: result.message,
        data: result, // Encapsulating result for better structure
      };
    } catch (e) {
      return {
        statusCode: 500, // Use a status from the error if available
        message: e.message || 'Internal Server Error',
      };
    }
  }


  @Post('register')
  async register(@Body() user: any) {
    // try {
    return await this.authService.register(user)
    // }catch(e){
    //   console.log(e)
    //   throw new Error(e.message)
    // }
  }

  @UseGuards(JwtAuthGuard)
  @Post('change_password')
  async changePassword(@UserOne("_id") userId: any, @Body() user: any) {
    // try {
    return await this.authService.changePassword(userId, user)
    // }catch(e){
    //   console.log(e)
    //   throw new Error(e.message)
    // }
  }

  
  @Post('forgot-password')
  async forgotPassword(@Body() user: any) {
    // try {
    return await this.authService.forgotPassword(user)
  }
  @Post('reset-password')
  async resetPassword(@Body() user: any) {
    // try {
    return await this.authService.resetPassword(user)
  }
}
