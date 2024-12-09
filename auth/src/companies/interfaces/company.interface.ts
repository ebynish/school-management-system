// src/companies/interfaces/company.interface.ts
import { Document } from 'mongoose';

export interface Company extends Document {
  _id: string;
  name: string;
  subsidiaries: string[]; // An array of subsidiary IDs associated with the company
}
