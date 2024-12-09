import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TerritoryService } from '../services/territory.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { BranchService } from 'src/branch/services/branch.service';
import { UserOne } from 'src/decorators/user.decorator';

@Controller('territories')
export class TerritoryController {
  constructor(private readonly territoryService: TerritoryService,
    private readonly branchService: BranchService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Post()
  async createTerritory(@Body('name') name: string, @Body('description') description: string, @Body('companyId') companyId: string) {
    return this.territoryService.createTerritory(name, description, companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Get()
  async getAllTerritories() {
    return await this.territoryService.getAllTerritories();
  }

  

  @UseGuards(JwtAuthGuard)
  @Get('byType/:type')
  async findTerritory(@Param('type') type: any){
    return await this.territoryService.findByType(type)
  }

  
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Get(':id')
  async getTerritoryById(@Param('id') id: string) {
    return this.territoryService.getTerritoryById(id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('getBySubsidiary/:id')
  async getTerritoryBySubsidiaries(@Param('id') id: string) {
    return this.territoryService.getTerritoryBySubsidiary(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Put(':id')
  async updateTerritory(@Param('id') id: string, @Body() updateDto: any) {
    return this.territoryService.updateTerritory(id, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Delete(':id')
  async deleteTerritory(@Param('id') id: string) {
    return this.territoryService.deleteTerritory(id);
  }
}


