import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { Connection } from 'mongoose';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthClientService {
  private client: ClientProxy;
  private emailClient: ClientProxy;
  

  constructor(@InjectConnection() private readonly connection: Connection) {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'localhost', port: Number(`${process.env.AUTH_PORT_EXTERNAL}`) }, // Adjust host and port as necessary
    });
    this.emailClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'localhost', port: Number(`${process.env.EMAIL_PORT_EXTERNAL}`) }, // Adjust host and port as necessary
    });
  }

  async login(user:any): Promise<any> {
    const response = await firstValueFrom(
      this.client.send({ cmd: 'login' }, user)
    );
    return response;
  }

  async register(user:any): Promise<any> {
    const response = await firstValueFrom(
      this.client.send({ cmd: 'register' }, user)
    );
    return response;
  }
  async changePassword(userId:any, user:any): Promise<any>{
    let res = { userId, ...user}
    const response = await firstValueFrom(
      this.client.send({ cmd: 'change_password' }, res)
    );
    return response;
  }
  async forgotPassword(user:any): Promise<any>{
    try{
    const response = await firstValueFrom(
      this.client.send({ cmd: 'forgot-password' }, user)
    );

    console.log(response.data)
      
    if (response.data){
      firstValueFrom(this.emailClient.send({ cmd: 'notification' }, { data: { email: response.data.email, firstName: response.data.firstName, type: 'forgot', resetLink: `/reset-password/${response.resetToken}` }}))
    }
    return { statusCode: 200, message: 'Reset token set to email'}
    }catch(e){
      return { statusCode: 500, message: e.message}
    }
  }
  
  async resetPassword(user:any): Promise<any>{
    try{
    const response = await firstValueFrom(
      this.client.send({ cmd: 'reset-password' }, user)
    );
    console.log(response.data)
    if (response.data)
      firstValueFrom(this.emailClient.send({ cmd: 'notification' }, {data:{ email: response.data.email, firstName: response.data.firstName, type: 'reset'}}))
    return { statusCode: 200, message: 'Password reset successful'}
  }catch(e){
    return { statusCode: 500, message: e.message}
  }
  }
  async registerStudent(data:any): Promise<any>{
    const user = await this.connection.collection('transactions').findOne({ _id: new mongoose.Types.ObjectId(data) });
    const usersCollection = this.connection.collection('users');
    let prefix = `${user?.programmeCode}/${user?.courseCode}/${user?.session?.slice(-2)}/`
    // Query for the highest number with the given prefix
    
    const lastEntry = await usersCollection
      .find({ matricNumber: { $regex: `^${prefix}/` } })
      .sort({ matricNumber: -1 }) // Sort in descending order
      .limit(1)
      .toArray();
  
    // Extract the numeric part and increment it
    let nextNumber = '0000001'; // Default if no entry exists
    if (lastEntry.length > 0) {
      const lastMatricNumber = lastEntry[0].matricNumber;
      const lastNumber = parseInt(lastMatricNumber.split('/').pop(), 10);
      nextNumber = String(lastNumber + 1).padStart(7, '0');
    }
  
    
    // Create the new matric number
    const newMatricNumber = `${prefix}${nextNumber}`;
    let newUser = {
      matricNumber: newMatricNumber,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phone: user?.phone,
      programmeId: new mongoose.Types.ObjectId(`${user?.programmeId}`),
      departmentId: new mongoose.Types.ObjectId(`${user?.courseId}`),
      programmeName: user?.programmeName,
      departmentCode: user?.courseCode,
      departmentName: user?.courseName,
      level: user?.tempLevel,
      password: newMatricNumber,
      role: new mongoose.Types.ObjectId("658cb0e28f6a90879cb71f6f"),
      username: newMatricNumber
    }
    
    const response = await firstValueFrom(
      this.client.send({ cmd: 'register' }, newUser)
    );

    await firstValueFrom(this.emailClient.send({ cmd: 'notification' }, {data: newUser, type: 'matric'}))

    return response;
  }
}
