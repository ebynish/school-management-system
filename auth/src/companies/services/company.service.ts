// company/company.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from '../schemas/company.schema';

@Injectable()
export class CompanyService {
  constructor(@InjectModel(Company.name) private companyModel: Model<CompanyDocument>) {}

  async createCompany(name: string, description: string): Promise<Company> {
    const newCompany = new this.companyModel({ name, description });
    return newCompany.save();
  }

  async getAllCompanies(): Promise<Company[]> {
    return this.companyModel.find().exec();
  }

  async getCompanyById(companyId: string): Promise<Company | null> {
    return this.companyModel.findById(companyId).exec();
  }

  async updateCompany(companyId: string, description: string): Promise<Company | null> {
    const updatedCompany = await this.companyModel.findByIdAndUpdate(
      companyId,
      { $set: { description } },
      { new: true }
    ).exec();
    return updatedCompany;
  }

  async deleteCompany(companyId: string): Promise<Company | null> {
    return this.companyModel.findByIdAndDelete(companyId).exec();
  }
}
