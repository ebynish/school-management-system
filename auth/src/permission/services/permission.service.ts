// permissions/permissions.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Permission, PermissionDocument } from '../schemas/permission.schema';
import { CreatePermissionDto } from '../dto/create-permission.dto';
@Injectable()
export class PermissionService {
  constructor(@InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>) {}

  async createPermission(CreatePermissionDto): Promise<PermissionDocument> {
    console.log(CreatePermissionDto)
    const newPermission = new this.permissionModel(CreatePermissionDto);
    return await newPermission.save();
  }

  async findAll(page: number, limit: number, searchText: string):Promise<any> {
    try{
        let query = {};

        // Implementing search functionality
        if (searchText) {
          query = {
            $or: [
              { name: new RegExp(searchText, 'i') },
            ],
          };
        }

        const totalItems = await this.permissionModel.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);
        const items = await this.permissionModel
          .find(query)
          .skip((page - 1) * limit)
          .limit(limit)
          .exec();

        return {
          statusCode: 200,
          totalPages,
          rows: items,
          totalItems,
          currentPage: page
        };
    }catch(e){
      throw new Error(e.message)
    }
  }

  async findPermissions():Promise<any> {
    
    try {
      const roles = await this.permissionModel.find({}).exec();
    
      return {
        data: roles,
        statusCode: 200
      };
    } catch (error) {
      // Handle any errors that may occur during the database query
      console.error("Error fetching users:", error);
      return null;
    }
  }


  async findPermissionById(permissionId: string): Promise<PermissionDocument | null> {
    return this.permissionModel.findById(permissionId).exec();
  }
  
  async findPermissionsByIds(permissionIds: ObjectId[]): Promise<PermissionDocument[]> {
    const permissions = await this.permissionModel.find({ _id: { $in: permissionIds } }).exec();
    return permissions;
  }
  

  async showActivePermissions(): Promise<PermissionDocument[]> {
    return this.permissionModel.find({ isActive: true }).exec();
  }

  async disablePermission(permissionId: string): Promise<PermissionDocument | null> {
    const disabledPermission = await this.permissionModel.findByIdAndUpdate(
      permissionId,
      { isActive: false },
      { new: true }
    ).exec();

    return disabledPermission;
  }
}
