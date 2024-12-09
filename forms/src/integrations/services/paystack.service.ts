import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { CustomException } from '../error.interface';



@Injectable()
export class PaystackService {
  private readonly apiKey: string;
  private readonly apiBaseURL: string;

  constructor(private readonly httpService: HttpService) {
    this.apiBaseURL = `https://api.paystack.co/`;
  }

  async resolveAccountNumber(accountNumber: string, bankCode: string, country: string): Promise<any> {
    try {
      let endpoint: string;

      if (country === 'NG' || country === 'GH') {
        endpoint = 'bank/resolve';
      } else if (country === 'ZA') {
        endpoint = 'bank/resolve_bvn_or_account_number';
      } else {
        throw new Error('Invalid country specified');
      }

      const response = await this.httpService
        .get(`${this.apiBaseURL}${endpoint}?account_number=${accountNumber}&bank_code=${bankCode}`, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      console.error('Error resolving account number:', error.response.status, error.response.data);
      // throw new Error('Error resolving account number');
      throw new CustomException('Error resolving account number', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async createVirtualAccount(payload: any): Promise<any> {

    
    try {
      const response = await this.httpService
        .post(`${this.apiBaseURL}dedicated_account`, payload, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
        })
        .toPromise();
      
      return response.data;
    } catch (error) {
      console.log(error.response.data)
      console.error('Error creating virtual account:', error.response.data);
      throw error;
    }
  }

  async assignVirtualAccount(accountId: string, customerData: any): Promise<any> {
    try {
      const response = await this.httpService
        .post(`${this.apiBaseURL}customer`, customerData, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
          params: {
            customer_code: accountId,
          },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      console.error('Error assigning virtual account:', error.response.data);
      throw error;
    }
  }

  async processCardPayment(paymentData: any): Promise<any> {
    try {
      const response = await this.httpService
        .post(`${this.apiBaseURL}transaction/initialize`, paymentData, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      console.error('Error processing card payment:', error.response.data);
      throw error;
    }
  }

  async chargeCard(cardData: any): Promise<any> {
    try {
      const response = await this.httpService
        .post(`${this.apiBaseURL}charge`, cardData, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      console.error('Error charging card:', error.response.data);
      throw error;
    }
  }

  async verifyPayment(reference: string): Promise<any> {
    try {
      const response = await this.httpService
        .get(`${this.apiBaseURL}transaction/verify/${reference}`, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error.response.data);
      throw error;
    }
  }

  async initiateTransfer(transferData: any): Promise<any> {
    try {
      const response = await this.httpService
        .post(`${this.apiBaseURL}transfer`, transferData, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      console.error('Error initiating transfer:', error.response.data);
      throw error;
    }
  }

  async initiateBulkTransfer(transferData: any): Promise<any> {
    try {
      const response = await this.httpService
        .post(`${this.apiBaseURL}transfer/bulk`, transferData, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      console.error('Error initiating bulk transfer:', error.response.data);
      throw error;
    }
  }

  async verifyAccount(accountNumber: string, bankCode: string): Promise<any> {
    try {
      const response = await this.httpService
        .get(`${this.apiBaseURL}bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      console.error('Error verifying account:', error.response.data);
      throw error;
    }
  }

  async createSubscription(subscriptionData: any): Promise<any> {
    try {
      const response = await this.httpService
        .post(`${this.apiBaseURL}subscription`, subscriptionData, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      console.error('Error creating subscription:', error.response.data);
      throw error;
    }
  }

  async chargeAuthorization(authorizationCode: string, paymentData: any): Promise<any> {
    try {
      const response = await this.httpService
        .post(`${this.apiBaseURL}transaction/charge_authorization`, paymentData, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
          params: {
            authorization_code: authorizationCode,
          },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      console.error('Error charging authorization:', error.response.data);
      throw error;
    }
  }

  async chargeBankAccount(accountData: any): Promise<any> {
    try {
      const response = await this.httpService
        .post(`${this.apiBaseURL}charge`, accountData, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      console.error('Error charging bank account:', error.response.data);
      throw error;
    }
  }

  async getTransaction(transactionId: string): Promise<any> {
    try {
      const response = await this.httpService
        .get(`${this.apiBaseURL}transaction/${transactionId}`, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      console.error('Error getting transaction:', error.response.data);
      throw error;
    }
  }

  async exportTransactions(params: any): Promise<any> {
    try {
      const response = await this.httpService
        .get(`${this.apiBaseURL}transaction/export`, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
          params,
        })
        .toPromise();

      return response.data;
    } catch (error) {
      console.error('Error exporting transactions:', error.response.data);
      throw error;
    }
  }

  async getTransfer(transferId: string): Promise<any> {
    try {
      const response = await this.httpService
        .get(`${this.apiBaseURL}transfer/${transferId}`, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      console.error('Error getting transfer:', error.response.data);
      throw error;
    }
  }

  async initiateBulkCharge(chargeData: any): Promise<any> {
    try {
      const response = await this.httpService
        .post(`${this.apiBaseURL}bulkcharge`, chargeData, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      console.error('Error initiating bulk charge:', error.response.data);
      throw error;
    }
  }

  async updateVirtualAccount(accountId: string, accountData: any): Promise<any> {
    try {
      const response = await this.httpService
        .put(`${this.apiBaseURL}virtual_accounts/${accountId}`, accountData, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      console.error('Error updating virtual account:', error.response.data);
      throw error;
    }
  }

  async deactivateVirtualAccount(accountId: string): Promise<any> {
    try {
      const response = await this.httpService
        .post(`${this.apiBaseURL}deactivate/${accountId}`, null, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      console.error('Error deactivating virtual account:', error.response.data);
      throw error;
    }
  }

  async getCustomer(customerCode: string): Promise<any> {
    try {
      const response = await this.httpService
        .get(`${this.apiBaseURL}customer/${customerCode}`, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      console.error('Error retrieving customer information:', error.response.data);
      throw error;
    }
  }

  async refundPayment(transactionId: string, refundData: any): Promise<any> {
    try {
      const response = await this.httpService
        .post(`${this.apiBaseURL}refund/${transactionId}`, refundData, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      console.error('Error refunding payment:', error.response.data);
      throw error;
    }
  }

  async getBankList(): Promise<any> {
    try {
      const response = await this.httpService
        .get(`${this.apiBaseURL}bank`, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      console.error('Error retrieving bank list:', error.response.data);
      throw error;
    }
  }

  async cancelSubscription(subscriptionCode: string): Promise<any> {
    try {
      const response = await this.httpService
        .post(`${this.apiBaseURL}subscription/disable`, null, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
          params: {
            code: subscriptionCode,
          },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      console.error('Error canceling subscription:', error.response.data);
      throw error;
    }
  }

  async enableSubscription(subscriptionCode: string): Promise<any> {
    try {
      const response = await this.httpService
        .post(`${this.apiBaseURL}subscription/enable`, null, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
          params: {
            code: subscriptionCode,
          },
        })
        .toPromise();

      return response.data;
    } catch (error) {
      console.error('Error enabling subscription:', error.response.data);
      throw error;
    }
  }
  async createCustomer(payload: any): Promise<any> {
    let accountData = { first_name: payload.firstName, last_name: payload.lastName, phone: payload.phone, email: payload.email };
    try {
      const response = await this.httpService
        .post(`${this.apiBaseURL}customer`, accountData, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
        })
        .toPromise();
  
      return response.data.data;
    } catch (error) {
      console.error('Error creating customer:', error.response.data);
      throw error;
    }
  }
  async validateCustomer(customerId: string, identificationType: string, identificationNumber: string): Promise<any> {
    const url = `${this.apiBaseURL}customer/${customerId}/identification`;
    const payload = {
      type: identificationType,
      number: identificationNumber,
    };

    try {
      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error('Failed to validate customer on Paystack');
    }
  }
  async country(): Promise<any> {
    const url = `${this.apiBaseURL}country`;
    
    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${process.env.PAYSTACK_SECRET}`,
          'Content-Type': 'application/json'
        },
      });
    
      return response.data;
    } catch (error) {
      throw new Error('Failed to validate customer on Paystack');
    }
  }
}