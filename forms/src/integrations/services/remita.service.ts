// remita.service.ts
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';
import { Connection } from 'mongoose';


@Injectable()
export class RemitaService {
  constructor(@InjectConnection() private readonly connection: Connection,){

  }
  
  
  
  async getConfig() {
    return this.connection.collection("configs").findOne(); // Fetching the first available config, or you can adjust the query
  }

  generateApiHash(
    merchantId: string,
    serviceTypeId: string,
    orderId: string,
    totalAmount: number,
    apiKey: string,
  ): string {
    try {
      // Convert totalAmount to a string to ensure consistent concatenation
      const concatenatedData = `${merchantId}${serviceTypeId}${orderId}${totalAmount}${apiKey}`;

      // Generate SHA-512 hash
      const apiHash = CryptoJS.SHA512(concatenatedData).toString(CryptoJS.enc.Hex);

      return apiHash;
    } catch (error) {
      throw new Error(`Error generating Remita API hash: ${error.message}`);
    }
  }
  generateStatusHash(
    rrr: Number,
    apiKey: string,
    merchantId: string
  ): string {
    try {
      // Convert totalAmount to a string to ensure consistent concatenation
      const concatenatedData = `${rrr}${apiKey}${merchantId}`;

      // Generate SHA-512 hash
      const apiHash = CryptoJS.SHA512(concatenatedData).toString(CryptoJS.enc.Hex);

      return apiHash;
    } catch (error) {
      throw new Error(`Error generating Remita API hash: ${error.message}`);
    }
  }
  async getUaaToken(): Promise<any> {
    try {
      let { remita } = await this.getConfig();
      const response = await axios.post(
        `${remita.baseUrl}/uaasvc/uaa/token`,
        {
          username: remita.username,
          password: remita.password,
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Error getting Remita UAA token: ${error.message}`);
    }
  }

  async generateInvoice(payload: any): Promise<any> {
    try {
      let { remita } = await this.getConfig();
      
      const apiHash = this.generateApiHash(
        remita?.merchantId,
        remita?.serviceTypeId,
        payload?.orderId,
        payload.amount,
        remita?.apiKey
      );
     
      const response = await axios.post(
        `${remita?.baseUrl}/echannelsvc/merchant/api/paymentinit`,
        {
          serviceTypeId: remita?.serviceTypeId,
          amount: payload?.amount,
          orderId: payload?.orderId,
          payerName: payload?.firstName+" "+payload.lastName,
          payerEmail: payload?.email,
          payerPhone: payload.phone,
          description: payload?.description,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `remitaConsumerKey=${remita?.merchantId},remitaConsumerToken=${apiHash}`,
          },
        }
      );
  
     
      // Return the JSON data from the Remita API response
      
      const jsonpResponse = response.data;
      console.log(jsonpResponse)
      if (!jsonpResponse?.includes("({")){
        return { statusCode: 500, message: jsonpResponse.statusMessage}
      }
      const jsonDataStart = jsonpResponse?.indexOf('{');
      const jsonDataEnd = jsonpResponse?.lastIndexOf('}');
      const jsonString = jsonpResponse?.substring(jsonDataStart, jsonDataEnd + 1);
      // Parse the JSON string
      const parsedData = JSON.parse(jsonString);
      return parsedData;
    } catch (error) {
      console.log(error)
      console.log(error.message, "msg")
      throw new Error(`Error generating Remita invoice: ${error.message}`);
    }
  }
  

  async checkPaymentStatus(payload: any): Promise<any> {
    let { remita } = await this.getConfig();
    try {
      const apiHash = this.generateStatusHash(
        payload?.RRR,
        remita?.apiKey,
        remita?.merchantId,
      );
      
      const response = await axios.get(
        `${remita?.baseUrl}/echannelsvc/${remita?.merchantId}/${payload?.RRR}/${apiHash}/status.reg`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `remitaConsumerKey=${remita?.merchantId},remitaConsumerToken=${apiHash}`,
          },
        }
      );
       
      return response.data;
    } catch (error) {
      
      throw new Error(`Error checking Remita payment status: ${error.message}`);
    }
  }

//   async processPaymentDetails(paymentDetails: any): Promise<any> {
//     try {
//       // Assuming your listening URL is stored in your environment variables or configuration

//       const response = await axios.post(
//         `${this.remitaBaseUrl}/yourListeningUrl`,
//         paymentDetails,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       return response.data;
//     } catch (error) {
//       throw new Error(`Error processing Remita payment details: ${error.message}`);
//     }
//   }

  async initiatePayment(paymentDetails: any): Promise<any> {
    try {
      let { remita } = await this.getConfig();
      const response = await axios.post(
        `${remita?.baseUrl}/`,
        paymentDetails,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Error initiating Remita payment: ${error.message}`);
    }
  }

  // Function to generate a random number based on current time
async generateRandomNumber() {
  const currentTime = new Date().getTime();
  const randomSeed = currentTime % 1000000; // Use the last 6 digits for better randomness
  const randomNumber = Math.floor(Math.random() * randomSeed);
  return randomNumber;
}

  // You can add more Remita-related methods as needed
}
