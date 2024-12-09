import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Connection, Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>,
  @InjectConnection() private readonly connection: Connection) {}

  async findAll(page: number, limit: number, searchText: string):Promise<any> {
    try{
        let query = {};

        // Implementing search functionality
        if (searchText) {
          query = {
            $or: [
              { firstName: new RegExp(searchText, 'i') },
              { lastName: new RegExp(searchText, 'i') },
              { email: new RegExp(searchText, 'i') },
            ],
          };
        }

        const totalItems = await this.userModel.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);
        const items = await this.userModel
          .find(query).populate("role")
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


  // Find a single user by ID
  async findOne(id: string): Promise<any> {
    try {
      const user = await this.userModel.findById(id).populate("role").lean();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  // Find a user by username
  async findOneByUsername(username: string): Promise<any> {
      const user = await this.userModel.findOne({ username: username }).exec();
    
  }

  
  // Find a user by username
  async findOneByEmail(email: string): Promise<any> {
    
      const user = await this.userModel.findOne({ email: email }).exec();  
      return user;
    
  }

  async findOneByEmailOrPhone(email: string): Promise<any> {
    
    const user = await this.userModel.findOne({ $or: [{ email: email },{ username: email }]}).populate("role").lean();  
    return user;
  
}

  // Create a new user
  async create(createUserDto: any): Promise<any> {
    try {
      const newUser = await this.connection.collection("users").insertOne(createUserDto);
      return newUser;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  // Update an existing user
  async update(id: string, updateUserDto: any): Promise<any> {
    try {
      const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  // Delete a user
  async remove(id: string): Promise<void> {
    try {
      const result = await this.userModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  // Save reset password token for a user
  async saveResetPasswordToken(userId: string, resetToken: string): Promise<void> {
    try {
      let update = await this.userModel.updateMany({_id: userId}, {
        resetPasswordToken: resetToken,
        resetPasswordExpires: Date.now() + 3600000 // 1 hour expiration
    }).exec();
    console.log(update)
    } catch (error) {
      throw new InternalServerErrorException('Failed to save reset password token');
    }
  }

  // Find a user by their reset password token
  async findOneByResetPasswordToken(resetPasswordToken: string): Promise<any> {
    try {
      const user = await this.userModel.findOne({
        resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() }
      }).exec();

      if (!user) {
        throw new NotFoundException('Invalid or expired reset token');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  // Update the password of a user
  async updatePassword(userId: string, newPassword: string): Promise<void> {
    try {
      await this.userModel.findByIdAndUpdate(userId, { password: newPassword }).exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to update password');
    }
  }

  // Clear the reset password token after a password change
  async clearResetPasswordToken(userId: string): Promise<void> {
    try {
      await this.userModel.findByIdAndUpdate(userId, {
        resetPasswordToken: null,
        resetPasswordExpires: null
      }).exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to clear reset password token');
    }
  }

  // Get users by company
async getUsersByCompany(companyId: string):Promise<any> {
  if (!companyId) throw new Error("Company ID not found in user request.");

  const result = await this.userModel.aggregate([
    {
      $lookup: {
        from: "branches",
        localField: "branch",
        foreignField: "_id",
        as: "branch",
      },
    },
    { $unwind: "$branch" },
    {
      $lookup: {
        from: "territories",
        localField: "branch.territory",
        foreignField: "_id",
        as: "territory",
      },
    },
    { $unwind: "$territory" },
    {
      $lookup: {
        from: "companies",
        localField: "territory.company",
        foreignField: "_id",
        as: "company",
      },
    },
    { $unwind: "$company" },
    {
      $match: {
        "company._id": new mongoose.Types.ObjectId(companyId),
      },
    },
  ]);

  return result;
};

// Get users by territory
async getUsersByTerritory(territoryId: string):Promise<any> {
  if (!territoryId) throw new Error("Territory ID not found in user request.");

  const result = await this.userModel.aggregate([
    {
      $lookup: {
        from: "branches",
        localField: "branch",
        foreignField: "_id",
        as: "branch",
      },
    },
    { $unwind: "$branch" },
    {
      $lookup: {
        from: "territories",
        localField: "branch.territory",
        foreignField: "_id",
        as: "territory",
      },
    },
    { $unwind: "$territory" },
    {
      $match: {
        "territory._id": new mongoose.Types.ObjectId(territoryId),
      },
    },
  ]);

  return result;
};

// Get users by branch
async getUsersByBranch(branchId: string):Promise<any> {
  if (!branchId) throw new Error("Branch ID not found in user request.");

  const result = await this.userModel.aggregate([
    {
      $lookup: {
        from: "branches",
        localField: "branch",
        foreignField: "_id",
        as: "branch",
      },
    },
    { $unwind: "$branch" },
    {
      $match: {
        "branch._id": new mongoose.Types.ObjectId(branchId),
      },
    },
  ]);

  return result;
};

// Get users by company and role
async getUsersByCompanyAndRole(companyId: string, roleId: string):Promise<any> {
  if (!companyId) throw new Error("Company ID not found in user request.");
  if (!roleId) throw new Error("Role ID not found in user request.");

  const result = await this.userModel.aggregate([
    {
      $match: {
        role: new mongoose.Types.ObjectId(roleId),
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "branch",
        foreignField: "_id",
        as: "branch",
      },
    },
    { $unwind: "$branch" },
    {
      $lookup: {
        from: "territories",
        localField: "branch.territory",
        foreignField: "_id",
        as: "territory",
      },
    },
    { $unwind: "$territory" },
    {
      $lookup: {
        from: "companies",
        localField: "territory.company",
        foreignField: "_id",
        as: "company",
      },
    },
    { $unwind: "$company" },
    {
      $match: {
        "company._id": new mongoose.Types.ObjectId(companyId),
      },
    },
  ]);

  return result;
};

// Get users by company and unit
async getUsersByCompanyAndUnit(companyId: string, unitId: string):Promise<any> {
  if (!companyId) throw new Error("Company ID not found in user request.");
  if (!unitId) throw new Error("Unit ID not found in user request.");

  const result = await this.userModel.aggregate([
    {
      $match: {
        unit: new mongoose.Types.ObjectId(unitId),
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "branch",
        foreignField: "_id",
        as: "branch",
      },
    },
    { $unwind: "$branch" },
    {
      $lookup: {
        from: "territories",
        localField: "branch.territory",
        foreignField: "_id",
        as: "territory",
      },
    },
    { $unwind: "$territory" },
    {
      $lookup: {
        from: "companies",
        localField: "territory.company",
        foreignField: "_id",
        as: "company",
      },
    },
    { $unwind: "$company" },
    {
      $match: {
        "company._id": new mongoose.Types.ObjectId(companyId),
      },
    },
  ]);

  return result;
};

// Get users by branch and role
async getUsersByBranchAndRole(branchId: string, roleId: string):Promise<any> {
  if (!branchId) throw new Error("Branch ID not found in user request.");
  if (!roleId) throw new Error("Role ID not found in user request.");

  const result = await this.userModel.aggregate([
    {
      $match: {
        role: new mongoose.Types.ObjectId(roleId),
        branch: new mongoose.Types.ObjectId(branchId),
      },
    },
  ]);

  return result;
};

// Get users by branch and unit
async getUsersByBranchAndUnit(branchId: string, unitId: string):Promise<any> {
  if (!branchId) throw new Error("Branch ID not found in user request.");
  if (!unitId) throw new Error("Unit ID not found in user request.");

  const result = await this.userModel.aggregate([
    {
      $match: {
        unit: new mongoose.Types.ObjectId(unitId),
        branch: new mongoose.Types.ObjectId(branchId),
      },
    },
  ]);

  return result;
};

// Get users by territory and role
async getUsersByTerritoryAndRole(territoryId: string, roleId: string):Promise<any> {
  if (!territoryId) throw new Error("Territory ID not found in user request.");
  if (!roleId) throw new Error("Role ID not found in user request.");

  const result = await this.userModel.aggregate([
    {
      $match: {
        role: new mongoose.Types.ObjectId(roleId),
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "branch",
        foreignField: "_id",
        as: "branch",
      },
    },
    { $unwind: "$branch" },
    {
      $lookup: {
        from: "territories",
        localField: "branch.territory",
        foreignField: "_id",
        as: "territory",
      },
    },
    { $unwind: "$territory" },
    {
      $match: {
        "territory._id": new mongoose.Types.ObjectId(territoryId),
      },
    },
  ]);

  return result;
};


async getUsersByTerritoryAndUnit(territoryId: any, unitId: any):Promise<any> {
  
    if (!territoryId) throw new Error("Territory ID not found in user request.");
    if (!unitId) throw new Error("Unit ID not found in user request.");

  const result = await this.userModel.aggregate([
    {
      $match: {
        unit: new mongoose.Types.ObjectId(unitId),
      },
    },
    {
      $lookup: {
        from: "branches",
        localField: "branch",
        foreignField: "_id",
        as: "branch",
      },
    },
    { $unwind: "$branch" },
    {
      $lookup: {
        from: "territories",
        localField: "branch.territory",
        foreignField: "_id",
        as: "territory",
      },
    },
    { $unwind: "$territory" },
    {
      $match: {
        "territory._id": new mongoose.Types.ObjectId(territoryId),
      },
    },
  ]);

  return result;
};

}
