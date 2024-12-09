import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PageClientService {
    private client: ClientProxy;

    constructor() {
      this.client = ClientProxyFactory.create({
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3013 },
      });
    }

  async findAll(page: number, limit:number, searchText: string):Promise<any> { 
    return await firstValueFrom(this.client.send({ cmd: 'get-pages' }, {page, limit, searchText}));
  }
  async findPages(id: any):Promise<any> { 
    
    return await firstValueFrom(this.client.send({ cmd: 'get-page' }, id));
  }
  
  async createPage(data: any) {
    
    return await firstValueFrom(this.client.send({ cmd: 'create-page' }, data));
  }
}
