import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Role, RoleDocument } from '../schemas/role.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { PermissionService } from 'src/permission/services/permission.service';
import { PermissionDocument } from 'src/permission/schemas/permission.schema';

@Injectable()
export class RolesService {
  constructor(@InjectModel('Role') private roleModel: Model<RoleDocument>,
  @InjectModel('User') private userModel: Model<UserDocument>,
  private permissionService: PermissionService) {}

  async createRole(roleData: Partial<Role>): Promise<Role> {
    const createdRole = new this.roleModel(roleData);
    return createdRole.save();
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

        const totalItems = await this.roleModel.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);
        const items = await this.roleModel
          .find(query)
          .skip((page - 1) * limit)
          .limit(limit)
          .populate({ path: 'permissions', model: 'Permission' })
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



  async findRoles():Promise<any> {
    
    try {
      const roles = await this.roleModel.find({}).exec();
    
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

  async findRoleById(roleId: string): Promise<Role | null> {
    let role = await this.roleModel.findOne({ _id: roleId}).populate({ path: 'permissions', model: 'Permission' })
    .exec();
    
    return role;
  }

  async showActiveRoles(): Promise<RoleDocument[]> {
    return this.roleModel.find({ isActive: true }).exec();
  }

  async disableRole(roleId: string): Promise<RoleDocument | null> {
    const disabledRole = await this.roleModel.findByIdAndUpdate(
      roleId,
      { isActive: false },
      { new: true }
    ).exec();

    return disabledRole;
  }

  async assignPermissions(roleId: string, permissionIds: ObjectId[]): Promise<RoleDocument | any> {
    
    try {
    const role = await this.roleModel.findById(roleId).exec();
    if (!role) {
      throw new NotFoundException('Role not found');
    }
  
    const permissions = await this.permissionService.findPermissionsByIds(permissionIds);
    if (!permissions || permissions.length !== permissionIds.length) {
      throw new NotFoundException('Some permissions not found');
    }
  
    const updatedRole = await this.roleModel.updateOne({ _id: roleId}, {$set: { permissions: permissionIds}}).exec()
  
    return { statusCode: 200, message: 'Update successfully'};
  }catch(e){
    return { status: e.responseCode, message: e.responseMessage}
  }

  }
  
  

  async assignRoleToUser(userId: string, roleId: string): Promise<any> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.userModel.updateOne({ _id: userId}, {$set: { role: roleId }}).exec()
    
  }  
  async hasPermission(roleName: string, permissionName: string): Promise<boolean> {
    const role = await this.roleModel.findOne({ name: roleName }).populate('permissions').exec();
  
    if (!role) {
      return false; // Role not found, so no permission
    }
    console.log(role.permissions)
    const hasPermission = role.permissions.some(permission => permission?._id === permissionName);
  
    return hasPermission;
  }

  
}
