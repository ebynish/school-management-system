import { Injectable } from '@nestjs/common';
import * as xlsx from 'xlsx';
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
      options: { host: 'localhost', port: 3002 },
    });
    this.client2 = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'localhost', port: 3002 },
    });
  }

  async findAll(page: number, limit: number, searchText: string): Promise<any> {
    return await firstValueFrom(this.client.send({ cmd: 'get-roles' }, { page, limit, searchText }));
  }

  async findRoles(): Promise<any> {
    return await firstValueFrom(this.client.send({ cmd: 'find-roles' }, {}));
  }

  async generateAdmissionLetter(applicantNumber: string): Promise<any> {
    return await firstValueFrom(this.client.send({ cmd: 'admission-letter' }, { applicantNumber }));
  }

  async getResults(data: any): Promise<any> {
    return await firstValueFrom(this.client.send({ cmd: 'getResult' }, data));
  }

  async calculateCGPA(data: any): Promise<any> {
    return await firstValueFrom(this.client.send({ cmd: 'calculateCGPA' }, data));
  }

  async getResultBySemester(studentId: string, semester: string): Promise<any> {
    return await firstValueFrom(this.client.send({ cmd: 'getResultBySemester' }, { studentId, semester }));
  }

  async getResultBySession(studentId: string, session: string): Promise<any> {
    return await firstValueFrom(this.client.send({ cmd: 'getResultBySession' }, { studentId, session }));
  }

  async getTranscript(studentId: string): Promise<any> {
    return await firstValueFrom(this.client.send({ cmd: 'getTranscript' }, { studentId }));
  }

  async processUploadedScores(filePath: string): Promise<any> {
    const fileExtension = filePath.split('.').pop();
    let scores = [];

    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      scores = xlsx.utils.sheet_to_json(sheet);
    } else if (fileExtension === 'csv') {
      const csv = fs.readFileSync(filePath, 'utf-8');
      scores = this.parseCSV(csv);
    }

    fs.unlinkSync(filePath);

    return await firstValueFrom(this.client.send({ cmd: 'upload-results' }, scores));
  }

  private parseCSV(csv: string): any[] {
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',');
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = row[index].trim();
      });
      result.push(obj);
    }
    return result;
  }
}
