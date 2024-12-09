// src/territories/interfaces/territory.interface.ts
import { Document } from 'mongoose';

export interface Territory extends Document {
  _id: string;
  name: string;
  orbit: string;
  branches: string[]; // An array of branch IDs associated with the territory
}
