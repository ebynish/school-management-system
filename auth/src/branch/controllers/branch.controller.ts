import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException, 
   UseGuards } from '@nestjs/common';
import { BranchService } from '../services/branch.service';
import { Branch } from '../schemas/branch.schema';
import { Roles } from '../../decorators/roles.decorator';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';


@Controller('branch')
@UseGuards(JwtAuthGuard) // Apply guards at the controller level
export class BranchController {
  constructor(private readonly branchService: BranchService) {}


  @UseGuards(JwtAuthGuard)
  @Post()
  @Roles('admin') // Require 'admin' role to create a Branch
  async createBranch(@Body() createBranchDto: any): Promise<Branch> {
    return this.branchService.createBranch(createBranchDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllBranches(): Promise<Branch[]> {
    return this.branchService.getAllBranches();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getBranchById(@Param('id') id: string): Promise<Branch> {
    const Branch = await this.branchService.getBranchById(id);
    if (!Branch) {
      throw new NotFoundException('Branch not found');
    }
    return Branch;
  }

  // @UseGuards(JwtAuthGuard)
  @Put(':id')
  // @Roles('admin') // Require 'admin' role to update a Branch
  async updateBranch(@Param('id') id: string, @Body() updateBranchDto: any): Promise<Branch> {
    const updatedBranch = await this.branchService.updateBranch(id, updateBranchDto);
    if (!updatedBranch) {
      throw new NotFoundException('Branch not found');
    }
    return updatedBranch;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @Roles('admin') // Require 'admin' role to delete a Branch
  async deleteBranch(@Param('id') id: string): Promise<void> {
    const deleted = await this.branchService.deleteBranch(id);
    if (!deleted) {
      throw new NotFoundException('Business Unit not found');
    }
  }

  // @UseGuards(JwtAuthGuard)
  // // @Roles('admin') // Require 'admin' role to delete a Branch
  // @Get('/sharedTerritories/:id')
  // async getBranchesWithSharedTerritoryOrbitIDs(@Param('id') id: string): Promise<number[]> {
  //   return await this.branchService.findBranchesWithSameTerritory2(id);
  // }
  
  

}
