import { Injectable } from '@nestjs/common';
const Flutterwave = require('flutterwave-node-v3'); // Use CommonJS require


@Injectable()
export class FlutterwaveService {
  private flutterwaveApiUrl: string;
  private flw;

  constructor() {
    this.flutterwaveApiUrl = "https://api.flutterwave.com";
    this.flw = new Flutterwave("FLWPUBK_TEST-b1d3c745f0fc67b760a8cd40dcf282d3-X", "FLWSECK_TEST-fad71e47dc97ac15428f3057f656e406-X");

  }

  async transfer(payload:any): Promise<any>{
  try{    
      let data = {
        "account_bank": payload.bankCode,
        "account_number": payload.accountNumber,
        "amount": payload.amount,
        "narration": payload.narration || "",
        "currency": payload.currency,
        "reference": payload.reference,
        "callback_url": "https://www.flutterwave.com/ng/",
        "debit_currency": payload.debitCurrency
    } 
    const response = await this.flw.Transfer.initiate(payload)
  //   {
  //     "status": "success",
  //     "message": "Transfer Queued Successfully",
  //     "data": {
  //        "id": 396432,
  //        "account_number": "0690000040",
  //        "bank_code": "044",
  //        "full_name": "Alexis Sanchez",
  //        "created_at": "2023-03-11T01:14:21.000Z",
  //        "currency": "NGN",
  //        "debit_currency": "NGN",
  //        "amount": 5500,
  //        "fee": 26.875,
  //        "status": "NEW",
  //        "reference": "akhlm-pstmnpyt-rfxxgjlsioens007_PMCKDU_1",
  //        "meta": null,
  //        "narration": "Akhlm Pstmn Trnsfr xx007",
  //        "complete_message": "",
  //        "requires_approval": 0,
  //        "is_approved": 1,
  //        "bank_name": "ACCESS BANK NIGERIA"
  //     }
  //  }
    console.log(response);
  } catch (error) {
      console.log(error)
  }
  }


  

  async getFee ():Promise<any> {

    try {
        const payload = {
            "amount": "12500",
            "currency": "NGN"
        }

        const response = await this.flw.Transfer.fee(payload)
        console.log(response);
    } catch (error) {
        console.log(error)
    }
  }
  async getBanks ():Promise<any> {

  try {
      const payload = {
          
          "country":"NG" //Pass either NG, GH, KE, UG, ZA or TZ to get list of banks in Nigeria, Ghana, Kenya, Uganda, South Africa or Tanzania respectively
          
      }
      const response = await this.flw.Bank.country(payload)
      console.log(response);
  } catch (error) {
      console.log(error)
  }

}

async getAccountNumbers ():Promise<any> {

  try {
      const payload = {
          "order_ref": "URF_1579513580629_5981535", // This is the order reference returned in the virtual account number creation
      }
      const response = await this.flw.VirtualAcct.fetch(payload)
      console.log(response);
  } catch (error) {
      console.log(error)
  }

}
async verify ():Promise<any> {

  try {
      const payload = {"id": "288200108" //This is the transaction unique identifier. It is returned in the initiate transaction call as data.id
      }
      const response = await this.flw.Transaction.verify(payload)
      console.log(response);
  } catch (error) {
      console.log(error)
  }

}


async View_Transaction_Timeline ():Promise<any> {

  try {
      const payload = {
          "id": "1296063" //This is the unique transaction ID. It is returned in the verify transaction call as data.id
      }
      const response = await this.flw.Transaction.event(payload)
      console.log(response);
  } catch (error) {
      console.log(error)
  }

}


async refund ():Promise<any> {

  try {


      const payload = {
          "id": "5708", //This is the transaction unique identifier. It is returned in the initiate transaction call as data.id
          "amount":"10"
      }
      const response = await this.flw.Transaction.refund(payload)
      console.log(response);
  } catch (error) {
      console.log(error)
  }

}


  async createVirtualAccount(datam:any): Promise<any> {
    try {
      
      const payload = {
          "email": datam?.email,
          "is_permanent": true,
          "bvn": datam?.bvn,
          "tx_ref": datam?.customerNumber,
          // "phone_number": datam?.phoneNumber,
          // "first_name": datam?.firstName || datam?.companyName,
          // "last_name": datam?.lastName || datam?.registrationNumber,
          //  "narration": `${datam?.firstName} ${datam?.lastName}`
      }
      
      const {data} = await this.flw.VirtualAcct.create(payload);
        
      return { accountName: datam?.firstName ? `${datam?.firstName} ${datam?.lastName}`: `${datam?.companyName}`, accountNumber: data?.account_number, bankName: data?.bank_name, balance: 0, customerNumber: datam?.customerNumber }
      
  } catch (error) {
      throw new Error(error)
  }
  }

  // async createVirtualCard(): Promise<any> {
  //   const endpoint = `${this.flutterwaveApiUrl}/v3/virtual-cards`;
  //   const data = {
  //     currency: 'NGN',
  //   };

  //   const headers = {
  //     Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET}`,
  //   };

  //   return axios.post(endpoint, data, { headers });
  // }

  // async updateBVN(accountId: string, bvn: string): Promise<any> {
  //   const endpoint = `${this.flutterwaveApiUrl}/v3/virtual-account-numbers/${accountId}`;
  //   const data = {
  //     bvn,
  //   };

  //   const headers = {
  //     Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET}`,
  //   };

  //   return axios.patch(endpoint, data, { headers });
  // }

  // async deleteVirtualAccount(accountId: string): Promise<any> {
  //   const endpoint = `${this.flutterwaveApiUrl}/v3/virtual-account-numbers/${accountId}`;

  //   const headers = {
  //     Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET}`,
  //   };

  //   return axios.delete(endpoint, { headers });
  // }

  // Add more Flutterwave API methods here as needed

  // Example:
  // async retrieveVirtualAccount(accountId: string): Promise<any> {
  //   const endpoint = `${this.flutterwaveApiUrl}/v3/virtual-account-numbers/${accountId}`;

  //   const headers = {
  //     Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET}`,
  //   };

  //   return axios.get(endpoint, { headers });
  // }
}
