// src/services/forms.service.ts
import { Injectable, NotFoundException, InternalServerErrorException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class AppService {
  private client: ClientProxy;
  constructor(){
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'localhost', port: Number(process.env.AUTH_PORT_EXTERNAL) },
    });
  }
  
  // async getUserTimeline(userId: string, page: number = 1, limit: number = 10): Promise<forms[]> {
  //   // Fetch followed user IDs
  //   let followedUserIds, contributions;
  //   if (userId)    
  //        followedUserIds =  await firstValueFrom(this.client.send({ cmd: 'get_followed_user_ids' }, userId));
    
  //   if (userId && followedUserIds.length > 0){    
  //        contributions = await this.formsModel.find({ userId: { $in: followedUserIds ? followedUserIds : [] } })
  //           .sort({ createdAt: -1 }) 
  //           .skip((page - 1) * limit)
  //           .limit(limit)
  //           .exec();
  //   } else {
  //     contributions = await this.formsModel.find({}).lean()
  //     .sort({ createdAt: -1 }) 
  //     .skip((page - 1) * limit)
  //     .limit(limit)
  //     .exec();
  //   }
  //   let users = await firstValueFrom(this.client.send({ cmd: 'get-users' }, contributions.map((item) => item.user)));
    
  //   return contributions.map((contribution)=>{
  //     const updatedUser = users.find(user => user?._id == contribution.user);
  //     console.log(updatedUser)
  //     if (updatedUser) {
  //       return { ...contribution, user: updatedUser }; // Update the user if found
  //     }
  //     return contribution; 
  //   })
    
  // }


  // async findformss(limit: number = 10, lastformsId?: string): Promise<forms[]> {
  //   try {
  //     const query = lastformsId ? { _id: { $gt: lastformsId } } : {};
  //     return await this.formsModel.find(query).limit(limit).exec();
  //   } catch (error) {
  //     throw new InternalServerErrorException('Failed to retrieve formss');
  //   }
  // }
 
}
