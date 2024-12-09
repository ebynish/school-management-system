import { Body, Controller, Delete, Param, Post, Get, UseGuards } from '@nestjs/common';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { PermissionService } from '../services/permission.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Roles } from '../../decorators/roles.decorator';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('permissions')
export class PermissionsController {
  constructor(private permissionsService: PermissionService) {}
  
  
  @MessagePattern({ cmd: 'find-roles' })
  async getRoles(@Payload() data: any) {
    
    const roles = await this.permissionsService.findPermissions()
    return roles
  }

  @MessagePattern({ cmd: 'create-permission' })
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    console.log(CreatePermissionDto)
    return await this.permissionsService.createPermission(createPermissionDto);
  }

  @MessagePattern({ cmd: 'get-permissions' })
  async getPermission(@Payload() data: any) {
    console.log(data)
    let page = data?.page;
    let limit = data?.limit;
    let searchText = data?.searchText;

    return await this.permissionsService.findAll(page, limit, searchText);
  }
  
  
  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async getPermissionsById(@Body() payload: any) { 
    return await this.permissionsService.findPermissionsByIds(payload);
  }
  
}
