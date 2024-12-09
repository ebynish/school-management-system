// company/company.controller.ts

import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CompanyService } from '../services/company.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Roles } from '../../decorators/roles.decorator';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Post()
  async createCompany(@Body('name') name: string, @Body('description') description: string) {
    return this.companyService.createCompany(name, description);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Get()
  async getAllCompanies() {
    return this.companyService.getAllCompanies();
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Get(':id')
  async getCompanyById(@Param('id') id: string) {
    return this.companyService.getCompanyById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Put(':id')
  async updateCompany(@Param('id') id: string, @Body('description') description: string) {
    return this.companyService.updateCompany(id, description);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Delete(':id')
  async deleteCompany(@Param('id') id: string) {
    return this.companyService.deleteCompany(id);
  }
}
