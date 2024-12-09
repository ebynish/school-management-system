// Departments/Department.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department } from '../schemas/department.schema';

@Injectable()
export class DepartmentService {
  constructor(@InjectModel(Department.name) private DepartmentModel: Model<Department>) {}

  async createDepartment(name: string, description: string, subsidiaryId: string): Promise<Department> {
    const newDepartment = new this.DepartmentModel({ name, description, subsidiary: subsidiaryId });
    return newDepartment.save();
  }

  async getAllDepartments(page: number = 1): Promise<{ data: Department[], currentPage: number, totalPages: number, totalItems: number } | null> {
    const itemsPerPage = 10;
    const skipCount = (page - 1) * itemsPerPage;
    
    try {
      const totalCount = await this.DepartmentModel.countDocuments();
      const totalPages = Math.ceil(totalCount/itemsPerPage);

      const Departments = await this.DepartmentModel.find({}).skip(skipCount)
      .limit(itemsPerPage).exec();
     
      return {
        data: Departments,
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalCount
      };
    } catch (error) {
      // Handle any errors that may occur during the database query
      console.error("Error fetching department:", error);
      return null;
    }
  }

  async getDepartmentById(DepartmentId: string): Promise<Department | null> {
    return this.DepartmentModel.findById(DepartmentId).exec();
  }

  async updateDepartment(DepartmentId: string, updateDto: any): Promise<Department | null> {
    const updatedDepartment = await this.DepartmentModel.findByIdAndUpdate(
      DepartmentId,
      { $set: updateDto },
      { new: true }
    ).exec();
    return updatedDepartment;
  }

  async deleteDepartment(DepartmentId: string): Promise<Department | null> {
    return this.DepartmentModel.findByIdAndDelete(DepartmentId).exec();
  }
}
