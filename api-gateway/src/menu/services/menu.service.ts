import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MenuClientService {
    private client: ClientProxy;

    constructor() {
      this.client = ClientProxyFactory.create({
        transport: Transport.TCP,
        options: { host: 'localhost', port: Number(`${process.env.MENU_PORT_EXTERNAL}`) },
      });
    }

  async findAll(page: number, limit:number, searchText: string):Promise<any> { 
    return await firstValueFrom(this.client.send({ cmd: 'get-menu' }, {page, limit, searchText}));
  }
  async findMenu():Promise<any> { 
    return await firstValueFrom(this.client.send({ cmd: 'find-menu' }, {}));
  }
  
  async createMenu(data: any) {
    return await firstValueFrom(this.client.send({ cmd: 'create-menu' }, data));
  }
}
