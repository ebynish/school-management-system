// subsidiaries/subsidiary.controller.ts

import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { SubsidiaryService } from '../services/subsidiary.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('subsidiaries')
export class SubsidiaryController {
  constructor(private readonly subsidiaryService: SubsidiaryService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Post()
  async createSubsidiary(@Body('name') name: string, @Body('description') description: string, @Body('companyId') companyId: string) {
    return this.subsidiaryService.createSubsidiary(name, description, companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Get()
  async getAllSubsidiaries() {
    return this.subsidiaryService.getAllSubsidiaries();
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Get(':id')
  async getSubsidiaryById(@Param('id') id: string) {
    return this.subsidiaryService.getSubsidiaryById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Put(':id')
  async updateSubsidiary(@Param('id') id: string, @Body() updateDto: any) {
    return this.subsidiaryService.updateSubsidiary(id, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Delete(':id')
  async deleteSubsidiary(@Param('id') id: string) {
    return this.subsidiaryService.deleteSubsidiary(id);
  }
}
