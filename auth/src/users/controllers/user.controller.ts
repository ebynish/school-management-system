import { Controller, Post, Body, Put, Param, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserService } from '../services/user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: any) {
    return this.userService.create(createUserDto); 
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Param('id') id: string, @Body() updateUserDto: any, @Req() req) {
    // Ensure the user updating the profile has the necessary permissions
    if (req.user._id !== id) {
      throw new ForbiddenException('You do not have permission to update this profile');
    }
    return this.userService.update(id, updateUserDto);
  }

  @MessagePattern({ cmd: 'find-user' })
  async findOne(@Payload() data: any) {
    const user = await this.userService.findOne(data);
    return user
  }

  @MessagePattern({ cmd: 'get-users' })
  async getUsers(@Payload() data: any) {
    let page = data?.page;
    let limit = data?.limit;
    let searchText = data?.searchText;

    const user = await this.userService.findAll(page, limit, searchText);
    return user
  }


 
}
