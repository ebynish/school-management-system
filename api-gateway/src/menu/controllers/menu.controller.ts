
import { Controller, Post, Body, Req, UnauthorizedException, Get, Query, UseGuards } from '@nestjs/common';
import { MenuClientService } from '../services/menu.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('menu')
export class MenuClientController {
  constructor(private menuService: MenuClientService) {}


  @Get('')
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('q') searchText = ''
  ) {
    return this.menuService.findAll(+page, +limit, searchText);
  }


  @Get('findMenu')
  getMenu() {
    return this.menuService.findMenu();
  }


  @Get('createMenu')
  createMenu(@Body() payload: any) {
    return this.menuService.createMenu(payload);
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

