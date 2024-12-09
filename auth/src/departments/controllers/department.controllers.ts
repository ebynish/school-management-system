import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { DepartmentService } from '../services/department.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Roles } from '../../decorators/roles.decorator';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Post()
  async createDepartment(@Body('name') name: string, @Body('description') description: string, @Body('subsidiaryId') subsidiaryId: string) {
    return this.departmentService.createDepartment(name, description, subsidiaryId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Get()
  async getAllDepartments() {
    return await this.departmentService.getAllDepartments();
  }
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Get(':page')
  async getAllDepartmentsByPage(@Param('page') page: number) {
    return await this.departmentService.getAllDepartments(page);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Get(':id')
  async getDepartmentById(@Param('id') id: string) {
    return this.departmentService.getDepartmentById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Put(':id')
  async updateDepartment(@Param('id') id: string, @Body() updateDto: any) {
    return this.departmentService.updateDepartment(id, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Delete(':id')
  async deleteDepartment(@Param('id') id: string) {
    return this.departmentService.deleteDepartment(id);
  }
}
