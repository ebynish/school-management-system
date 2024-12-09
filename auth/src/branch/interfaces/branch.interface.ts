// src/branches/interfaces/branch.interface.ts
import { Document } from 'mongoose';

export interface Branch extends Document {
  _id: string;
  BU_NAME: string;
}
