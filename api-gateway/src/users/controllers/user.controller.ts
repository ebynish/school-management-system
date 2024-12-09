
import { Controller, Post, Body, Req, UnauthorizedException, Get, Query } from '@nestjs/common';
import { UserClientService } from '../services/user.service';

@Controller('users')
export class UserClientController {
  constructor(private userService: UserClientService) {}

  @Get('')
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('q') searchText = ''
  ) {
    return this.userService.findAll(+page, +limit, searchText);
  }

//   @Post('register')
//   async register(@Body() user: any) {
//     try {
//     return this.authService.register(user)
//     }catch(e){
//       console.log(e)
//       throw new Error(e.message)
//     }
//   }
}

