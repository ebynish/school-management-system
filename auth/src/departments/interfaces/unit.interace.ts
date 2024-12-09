// src/units/interfaces/unit.interface.ts
import { Document } from 'mongoose';

export interface Unit extends Document {
  _id: string;
  name: string;
  orbit_id: string;
  // Other properties specific to units
}
