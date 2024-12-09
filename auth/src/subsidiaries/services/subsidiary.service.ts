// subsidiaries/subsidiary.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subsidiary } from '../schemas/subsidiary.schema';

@Injectable()
export class SubsidiaryService {
  constructor(@InjectModel(Subsidiary.name) private subsidiaryModel: Model<Subsidiary>) {}

  async createSubsidiary(name: string, description: string, companyId: string): Promise<Subsidiary> {
    const newSubsidiary = new this.subsidiaryModel({ name, description, company: companyId });
    return newSubsidiary.save();
  }

  async getAllSubsidiaries(): Promise<Subsidiary[]> {
    return this.subsidiaryModel.find().exec();
  }

  async getSubsidiaryById(subsidiaryId: string): Promise<Subsidiary | null> {
    return this.subsidiaryModel.findById(subsidiaryId).exec();
  }

  async updateSubsidiary(subsidiaryId: string, updateDto: any): Promise<Subsidiary | null> {
    const updatedSubsidiary = await this.subsidiaryModel.findByIdAndUpdate(
      subsidiaryId,
      { $set: updateDto },
      { new: true }
    ).exec();
    return updatedSubsidiary;
  }

  async deleteSubsidiary(subsidiaryId: string): Promise<Subsidiary | null> {
    return this.subsidiaryModel.findByIdAndDelete(subsidiaryId).exec();
  }
}
