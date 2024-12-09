import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserClientService {
    private client: ClientProxy;

    constructor() {
      this.client = ClientProxyFactory.create({
        transport: Transport.TCP,
        options: { host: 'localhost', port: Number(`${process.env.AUTH_PORT_EXTERNAL}`) },
      });
    }

  async findAll(page: number, limit:number, searchText: string) {
    return await firstValueFrom(this.client.send({ cmd: 'get-users' }, {page, limit, searchText}));
  }
  async createUser(userData: any) {
    return await firstValueFrom(this.client.send({ cmd: 'create-user' }, userData));
  }
  
}
