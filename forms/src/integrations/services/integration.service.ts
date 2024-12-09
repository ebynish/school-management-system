import { InjectConnection } from '@nestjs/mongoose';
import { Injectable, BadRequestException } from '@nestjs/common';
import { FlutterwaveService } from './flutterwave.service';  // Adjust path as needed
import { RemitaService } from './remita.service';
import { Connection } from 'mongoose';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class IntegrationsService {
  client : ClientProxy
  constructor(private readonly flutterwaveService: FlutterwaveService,
          private readonly remitaService: RemitaService,
          @InjectConnection() private readonly connection: Connection,
    ) {
      this.client = ClientProxyFactory.create({
        transport: Transport.TCP,
        options: { host: 'localhost', port: Number(`${process.env.EMAIL_PORT_EXTERNAL}`) }, // Adjust host and port as necessary
      });
  

    }

  private generateReferenceNumber() {
    const timestamp = Date.now().toString(); // Get the current timestamp in milliseconds
    const randomPart = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit random number
    return `REF-${timestamp}-${randomPart}`;
  }
  async getConfig() {
    return this.connection.collection("configs").findOne(); // Fetching the first available config, or you can adjust the query
  }
  async generateAccount(data: any) {
    let bvn = data?.bvn ? data.bvn : data?.directors[0]?.directorBVN;
    let refNo = this.generateReferenceNumber();
    let formFields = { ...data, bvn, refNo } ;
    return await this.flutterwaveService.createVirtualAccount(formFields)
  }

  async generateInvoice(data:any){
     let result = await this.remitaService.generateInvoice(data);
      
     if (!result) {
        throw new BadRequestException('Failed to generate invoice.');
      }
    
  if (result.statusCode != 500){
      delete result.status
        // Step 2: Create the transaction record
        const transaction = {
          ...data,
          ...result,
          status: "Pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
  
        // Step 3: Insert the transaction record into the 'transactions' collection
      let response = await this.connection.collection("transactions").insertOne(transaction);
      if (response?.insertedId)
        this.client.send({ cmd: 'notification' }, {data, type: 'invoice'})
    return { statusCode:200, formData: data, transactionId: response?.insertedId}
    }else{
      return { statusCode: 500, message: result.message };
    }
  }
  async checkAndGenerateInvoice(data: any): Promise<any> {
    // Determine the filter field dynamically
    const filterField = data.applicationId ? { applicationId: data.applicationId } : { matricNumber: data.matricNumber };
  
    // Query the transactions collection for a pending invoice
    const response = await this.connection.collection("transactions").findOne({
      status: "Pending",
      type: data.type,
      ...filterField, // Dynamically adds applicationId or matricNumber to the query
    });
  
    
    // If a pending transaction exists, return its transaction ID
    if (response) {
      return { statusCode: 200, data: { transactionId: response?._id } };
    }
    
    // If no pending transaction exists, generate a new invoice
    const invoice = await this.generateInvoice(data);
    
    if (invoice.statusCode == 200){
      
      return { statusCode: 200, data: { transactionId: invoice?.transactionId } };
      
    }
    return { statusCode: 500, message: invoice.message };
  }
  
  async integrationTwo(data: any) {
    // Logic for integration two
    return { message: 'Integration Two called', data };
  }

  // General method to invoke any integration method
  async callIntegration(methodName: string, data: any) {
    
    // Check if the method exists on this service
    if (typeof this[methodName] === 'function') {
      return await this[methodName](data);
    } else {
      throw new BadRequestException(`Integration method '${methodName}' does not exist`);
    }
  }
}
