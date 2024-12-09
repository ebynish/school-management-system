import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FormClientService {
    private client: ClientProxy;

    constructor() {
      this.client = ClientProxyFactory.create({
        transport: Transport.TCP,
        options: { host: 'localhost', port: Number(`${process.env.FORMS_PORT_EXTERNAL}`) },
      });
    }

  async findAll(page: number, limit:number, searchText: string):Promise<any> { 
    return await firstValueFrom(this.client.send({ cmd: 'get-forms' }, {page, limit, searchText}));
  }
  async findTable(type: string, page: number, limit:number, searchText: string, id: string, mode: string, populate: string):Promise<any> { 
    return await firstValueFrom(this.client.send({ cmd: 'get-table' }, {type, page, limit, searchText, id, mode, populate}));
  }
  async getSummary(type:any, id: any){
    
    return await firstValueFrom(this.client.send({ cmd: 'get-summary' }, { type, id}));
  }
  async findByStatus(type: string, page: number, limit:number, searchText: string, status: string, id: string, mode: string, populate: string):Promise<any> { 
    return await firstValueFrom(this.client.send({ cmd: 'get-table' }, {type, page, limit, searchText, status, id, mode, populate}));
  }
  async findForms(id: any):Promise<any> { 
    return await firstValueFrom(this.client.send({ cmd: 'get-form' }, {id}));
  }
  async findData(schema: any, id : any, type: any, status: any):Promise<any> { 
    return await firstValueFrom(this.client.send({ cmd: 'get-data' }, {schema, id, type, status}));
  }
  async findFormsBySlug(id: any):Promise<any> { 
    return await firstValueFrom(this.client.send({ cmd: 'get-form-slug' }, {id}));
  }
  
  
  async createForm(data: any) {
    
    return await firstValueFrom(this.client.send({ cmd: 'create-form' }, data));
  }
  async submitForm(data: any) {
    let result  = await firstValueFrom(this.client.send({ cmd: 'submit-form' }, data))    
    return result;
  }
  async getWorkFlow(data: any) {
    
       return await firstValueFrom(this.client.send({ cmd: 'get-user-flow' }, {userId:data}));
  }
  async updateStatus(data: any) {
    
    return await firstValueFrom(this.client.send({ cmd: 'update-stage' }, data));
}
async update(schema: string, id: string, payload: any ) {
    
  return await firstValueFrom(this.client.send({ cmd: 'update-schema' }, {schema, id, payload}));
}

async generateInvoice(data:any ) {
    
  return await firstValueFrom(this.client.send({ cmd: 'generate-invoice' }, data));
}
}
