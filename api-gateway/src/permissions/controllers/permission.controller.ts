
import { Controller, Post, Body, Req, UnauthorizedException, Get, Query, UseGuards } from '@nestjs/common';
import { PermissionClientService } from '../services/permission.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('permissions')
export class PermissionClientController {
  constructor(private permissionService: PermissionClientService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('q') searchText = ''
  ) {
    return this.permissionService.findAll(+page, +limit, searchText);
  }

  @UseGuards(JwtAuthGuard)
  @Get('findPermissions')
  findPermissions() {
    return this.permissionService.findPermissions();
  }
//   @Post('register')
//   async register(@Body() permission: any) {
//     try {
//     return this.authService.register(permission)
//     }catch(e){
//       console.log(e)
//       throw new Error(e.message)
//     }
//   }
}

