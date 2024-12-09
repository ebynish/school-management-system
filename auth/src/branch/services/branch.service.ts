

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Branch } from '../schemas/branch.schema';

@Injectable()
export class BranchService {
  constructor(@InjectModel(Branch.name) private branchModel: Model<Branch>) {}

  async createBranch(createBranchDto): Promise<Branch> {
    const newBranch = new this.branchModel(createBranchDto);
    return newBranch.save();
  }

  async getAllBranches(): Promise<Branch[]> {
    return this.branchModel.find().exec();
  }

  async getBranchById(BranchId: string): Promise<Branch | null> {
    return this.branchModel.findById({_id: BranchId}).exec();
  }
  async getBranchByTerritoryId(territoryId: string): Promise<Branch | null> {
    return this.branchModel.findOne({ territory: territoryId }).exec();
  }
 
  async updateBranch(BranchId: string, updateDto: any): Promise<Branch | null> {
    const updatedBranch = await this.branchModel.findByIdAndUpdate(
      BranchId,
      { $set: updateDto },
      { new: true }
    ).exec();
    return updatedBranch;
  }

  async deleteBranch(BranchId: string): Promise<Branch | null> {
    return this.branchModel.findByIdAndDelete(BranchId).exec();
  }
  async findBranchesWithSameTerritory(territoryId: string): Promise<number[]> {
    const territoryObjectId = new Types.ObjectId(territoryId);
    const result = await this.branchModel.aggregate([
      {
        $match: {
          territory: territoryObjectId,
        },
      }])
    // const result = await this.branchModel.aggregate([
    //   {
    //     $match: {
    //       territory: territoryObjectId,
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: 'Branchs', // Ensure this matches the actual collection name
    //       localField: 'territory',
    //       foreignField: 'territory',
    //       as: 'sharedBranchs',
    //     },
    //   },
    //   {
    //     $unwind: '$sharedBranchs',
    //   },
    //   {
    //     $match: {
    //       'sharedBranchs._id': { $ne: null }, // Exclude documents without a matching Branch
    //       'sharedBranchs.territory': territoryObjectId, // Match the provided territory ID
    //     },
    //   },
    //   {
    //     $project: {
    //       BU_ID: '$sharedBranchs.BU_ID',
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: '$BU_ID',
    //       BU_IDs: { $addToSet: '$BU_ID' },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       BU_ID: '$_id',
    //     },
    //   },
    // ]);
  
    return result.map((item) => item.BU_ID);
  }
  async findBranchesWithSameTerritory2(territoryId: string): Promise<any> {
    try{
    const territoryObjectId = new Types.ObjectId(territoryId);
    const result = await this.branchModel.find({ territory: territoryObjectId});
      return result
  }catch(e){
    throw new Error(e.message)
  }
  }
  

  
  
  
}
