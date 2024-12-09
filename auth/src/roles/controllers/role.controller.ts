import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { RolesService } from '../services/role.service';
import { Role } from '../schemas/role.schema';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Roles } from '../../decorators/roles.decorator';
import { ObjectId } from 'mongoose';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @MessagePattern({ cmd: 'get-roles' })
  async getRole(@Payload() data: any) {
    console.log(data)
    let page = data?.page;
    let limit = data?.limit;
    let searchText = data?.searchText;

    const roles = await this.rolesService.findAll(page, limit, searchText);
    return roles
  }

  @MessagePattern({ cmd: 'find-roles' })
  async getRoles(@Payload() data: any) {
    
    const roles = await this.rolesService.findRoles()
    return roles
  }
  // @UseGuards(JwtAuthGuard)
  // @Roles('admin')
  // @Post()
  // async createRole(@Body() roleData: Partial<Role>): Promise<Role> {
  //   return this.rolesService.createRole(roleData);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Roles('admin')
  // @Get('AllRoles')
  // async getAllRoles(): Promise<any> {
  //   return await this.rolesService.findAllRoles();
  // }
  // @Get(':page')
  // async getAllRole(@Param("page") page: number): Promise<any> {
  //   return await this.rolesService.findAllRoles(page);
  // }
  // @UseGuards(JwtAuthGuard)
  // @Roles('admin')
  // @Get(':roleId')
  // async getRoleById(@Param('roleId') roleId: string): Promise<Role> {
  //   return await this.rolesService.findRoleById(roleId);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Roles('admin')
  @Get('getById/:roleId')
  async getRoleByUse(@Param('roleId') roleId: string): Promise<Role> {
    return await this.rolesService.findRoleById(roleId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Post(':roleId/assign-permissions')
  async assignPermissionsToRole(
    @Param('roleId') roleId: string,
    @Body() permissions: ObjectId[]
  ): Promise<any> {
    console.log(roleId, permissions)
    return await this.rolesService.assignPermissions(roleId, permissions);
  }

 
}
