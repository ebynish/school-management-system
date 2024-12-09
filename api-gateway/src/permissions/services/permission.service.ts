import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PermissionClientService {
    private client: ClientProxy;

    constructor() {
      this.client = ClientProxyFactory.create({
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3002 },
      });
    }

  async findAll(page: number, limit:number, searchText: string):Promise<any> { 
    return await firstValueFrom(this.client.send({ cmd: 'get-permissions' }, {page, limit, searchText}));
  }
  async findPermissions():Promise<any> { 
    return await firstValueFrom(this.client.send({ cmd: 'find-permissions' }, {}));
  }
  
  async createPermission(data: any) {
    return await firstValueFrom(this.client.send({ cmd: 'create-permission' }, data));
  }
}
