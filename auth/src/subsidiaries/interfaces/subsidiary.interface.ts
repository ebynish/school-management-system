// src/subsidiaries/interfaces/subsidiary.interface.ts
import { Document } from 'mongoose';

export interface Subsidiary extends Document {
  _id: string;
  name: string;
  orbit_id: string;
  territories: string[]; // An array of territory IDs associated with the subsidiary
  units: string[]; // An array of unit IDs associated with the subsidiary
}
