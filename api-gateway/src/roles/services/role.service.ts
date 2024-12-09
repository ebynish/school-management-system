import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RoleClientService {
    private client: ClientProxy;

    constructor() {
      this.client = ClientProxyFactory.create({
        transport: Transport.TCP,
        options: { host: 'localhost', port: Number(`${process.env.AUTH_PORT_EXTERNAL}`)  },
      });
    }

  async findAll(page: number, limit:number, searchText: string):Promise<any> { 
    return await firstValueFrom(this.client.send({ cmd: 'get-roles' }, {page, limit, searchText}));
  }
  async findRoles():Promise<any> { 
    return await firstValueFrom(this.client.send({ cmd: 'find-roles' }, {}));
  }
  
  async createRole(data: any) {
    return await firstValueFrom(this.client.send({ cmd: 'create-role' }, data));
  }
}
