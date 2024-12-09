import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class IDVerificationService {
  private readonly nigeriaVerificationUrl = 'https://api.youverify.co/api/v1/verify';
  private readonly ghanaVerificationUrl = 'https://api.innovategh.com/v1/verify';
  private readonly southAfricaVerificationUrl = 'https://api.transunion.co.za/v1/verify';
  private readonly kenyaVerificationUrl = 'https://api.veridocglobal.com/v1/verify';
  private readonly beninVerificationUrl = 'https://api.idcheck.io/v1/verify';
  private readonly togoVerificationUrl = 'https://api.idcheck.io/v1/verify';
  private readonly usVerificationUrl = 'https://api.trulioo.com/v1/verify';
  private readonly ukVerificationUrl = 'https://api.trulioo.com/v1/verify';
  private readonly canadaVerificationUrl = 'https://api.trulioo.com/v1/verify';


  async verifyID(country: string, id: string): Promise<AxiosResponse> {
    let verificationUrl: string;
    let data: any;

    switch (country) {
      case 'Nigeria':
        verificationUrl = this.nigeriaVerificationUrl;
        data = { id };
        break;
      case 'Ghana':
        verificationUrl = this.ghanaVerificationUrl;
        data = { id };
        break;
      case 'South Africa':
        verificationUrl = this.southAfricaVerificationUrl;
        data = { id };
        break;
      case 'Kenya':
        verificationUrl = this.kenyaVerificationUrl;
        data = { id };
        break;
      case 'Benin':
      case 'Togo':
        verificationUrl = this.beninVerificationUrl;
        data = { id };
        break;
      case 'United States':
      case 'United Kingdom':
      case 'Canada':
        verificationUrl = this.usVerificationUrl; // Use Trulioo for all three countries
        data = { id };
        break;
      default:
        throw new Error('Unsupported country');
    }

    return axios.post(verificationUrl, data);
  }

  async verifyNigeriaID(id: string): Promise<AxiosResponse> {
    const data = {
      id,
    };

    return axios.post(this.nigeriaVerificationUrl, data);
  }

  async verifyGhanaID(id: string): Promise<AxiosResponse> {
    const data = {
      id,
    };

    return axios.post(this.ghanaVerificationUrl, data);
  }

  async verifySouthAfricaID(id: string): Promise<AxiosResponse> {
    const data = {
      id,
    };

    return axios.post(this.southAfricaVerificationUrl, data);
  }

  async verifyKenyaID(id: string): Promise<AxiosResponse> {
    const data = {
      id,
    };

    return axios.post(this.kenyaVerificationUrl, data);
  }

  async verifyBeninID(id: string): Promise<AxiosResponse> {
    const data = {
      id,
    };

    return axios.post(this.beninVerificationUrl, data);
  }

  async verifyTogoID(id: string): Promise<AxiosResponse> {
    const data = {
      id,
    };

    return axios.post(this.togoVerificationUrl, data);
  }

  async verifyUSID(id: string): Promise<AxiosResponse> {
    const data = {
      id,
    };

    return axios.post(this.usVerificationUrl, data);
  }

  async verifyUKID(id: string): Promise<AxiosResponse> {
    const data = {
      id,
    };

    return axios.post(this.ukVerificationUrl, data);
  }

  async verifyCanadaID(id: string): Promise<AxiosResponse> {
    const data = {
      id,
    };

    return axios.post(this.canadaVerificationUrl, data);
  }
}
