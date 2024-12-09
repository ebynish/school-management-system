// territories/territory.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Territory } from '../schemas/territory.schema';

@Injectable()
export class TerritoryService {
  constructor(@InjectModel(Territory.name) private territoryModel: Model<Territory>) {}

  async createTerritory(name: string, description: string, companyId: string): Promise<Territory> {
    const newTerritory = new this.territoryModel({ name, description, company: companyId });
    return newTerritory.save();
  }

  async getAllTerritories(): Promise<Territory[]> {
    return this.territoryModel.find().exec();
  }

  async getTerritoryById(territoryId: string): Promise<Territory | null> {
    return this.territoryModel.findById({_id:territoryId}).exec();
  }
  
  async getTerritoryBySubsidiary(subsidiaryId: string): Promise<Territory | null> {
    return await this.territoryModel.findOne({ subsidiary: subsidiaryId}).exec();
  }

  async findByType(type: any): Promise<any>{
    let types = await this.territoryModel.find({ type: type }).exec();
    
    return types
  }
  async updateTerritory(territoryId: string, updateDto: any): Promise<Territory | null> {
    const updatedTerritory = await this.territoryModel.findByIdAndUpdate(
      territoryId,
      { $set: updateDto },
      { new: true }
    ).exec();
    return updatedTerritory;
  }

  async deleteTerritory(territoryId: string): Promise<Territory | null> {
    return this.territoryModel.findByIdAndDelete(territoryId).exec();
  }
}
