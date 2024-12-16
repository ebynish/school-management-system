import { Injectable } from '@nestjs/common';
import * as csvParser from 'csv-parser';
import * as ExcelJS from 'exceljs';

import * as fs from 'fs';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class StudentService {
  private client: ClientProxy;
  private client2: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'localhost', port: Number(`${process.env.AUTH_PORT_EXTERNAL}`)  },
    });
    this.client2 = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'localhost', port: Number(`${process.env.STUDENT_PORT_EXTERNAL}`)  },
    });
  }

  async findAll(page: number, limit: number, searchText: string): Promise<any> {
    return await firstValueFrom(this.client.send({ cmd: 'get-roles' }, { page, limit, searchText }));
  }

  async findRoles(): Promise<any> {
    return await firstValueFrom(this.client.send({ cmd: 'find-roles' }, {}));
  }

  async generateAdmissionLetter(applicantNumber: string): Promise<any> {
    return await firstValueFrom(this.client2.send({ cmd: 'admission-letter' }, { applicantNumber }));
  }

  async getResults(data: any): Promise<any> {
    return await firstValueFrom(this.client2.send({ cmd: 'getResult' }, data));
  }

  async calculateCGPA(data: any): Promise<any> {
    return await firstValueFrom(this.client2.send({ cmd: 'calculateCGPA' }, data));
  }

  async getResultBySemester(studentId: string, semester: string): Promise<any> {
    return await firstValueFrom(this.client2.send({ cmd: 'getResultBySemester' }, { studentId, semester }));
  }

  async getResultBySession(studentId: string, session: string): Promise<any> {
    return await firstValueFrom(this.client2.send({ cmd: 'getResultBySession' }, { studentId, session }));
  }

  async getTranscript(studentId: string): Promise<any> {
    return await firstValueFrom(this.client2.send({ cmd: 'getTranscript' }, { studentId }));
  }

  async processUploadedScores(path: string, originalname: string, payload:any): Promise<any> {
    
    let extractedData: any[];

    if (originalname.endsWith('.xlsx')) {
      // Process XLSX file dynamically
      extractedData = await this.parseXlsxFile(path);
    } else if (originalname.endsWith('.csv')) {
      // Process CSV file dynamically
      extractedData = await this.parseCsvFile(path);
    } else {
      throw new Error('Unsupported file format. Only .xlsx and .csv are allowed.');
    }

    
    return await firstValueFrom(this.client2.send({ cmd: 'upload-results' }, {extractedData, payload}));
  }

  private async parseXlsxFile(filePath: string): Promise<any[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
  
    const worksheet = workbook.worksheets[0]; // Get the first sheet
    const rows: any[] = [];
    let headers: string[] = [];
  
    worksheet.eachRow((row, rowIndex) => {
      // Convert `row.values` to a proper array and remove the first element (index column)
      const rowValues = Array.isArray(row.values) ? row.values.slice(1) : Object.values(row.values).slice(1);
  
      if (rowIndex === 1) {
        // First row contains headers
        headers = rowValues as string[];
      } else {
        // Map the headers to the row values dynamically
        const rowObject: { [key: string]: any } = {};
        headers.forEach((header, index) => {
          rowObject[header] = rowValues[index] ?? null;
        });
        rows.push(rowObject);
      }
    });
  
    return rows;
  }
  

  private parseCsvFile(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const rows: any[] = [];
      let headers: string[] = [];

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('headers', (headerRow) => {
          headers = headerRow;
        })
        .on('data', (data) => {
          rows.push(data);
        })
        .on('end', () => {
          resolve(rows);
        })
        .on('error', (error) => reject(error));
    });
  }
}
