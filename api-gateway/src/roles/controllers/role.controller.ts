
import { Controller, Post, Body, Req, UnauthorizedException, Get, Query, UseGuards } from '@nestjs/common';
import { RoleClientService } from '../services/role.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('roles')
export class RoleClientController {
  constructor(private roleService: RoleClientService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('q') searchText = ''
  ) {
    return this.roleService.findAll(+page, +limit, searchText);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('findRoles')
  findRoles() {
    return this.roleService.findRoles();
  }
//   @Post('register')
//   async register(@Body() role: any) {
//     try {
//     return this.authService.register(role)
//     }catch(e){
//       console.log(e)
//       throw new Error(e.message)
//     }
//   }
}

