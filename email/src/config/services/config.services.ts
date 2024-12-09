// src/email/services/configuration.service.ts
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class ConfigurationService {
  constructor(
    @InjectConnection() private readonly connection: Connection, // Inject Mongoose Connection
  ) {}

  /**
   * Retrieve the configuration from the "configs" collection
   */
  async getConfiguration(): Promise<any> {
    return this.connection.collection('configs').findOne(); // Find the first document in the "configs" collection
  }

  /**
   * Update the configuration in the "configs" collection
   * @param config - Partial configuration object
   */
  async updateConfiguration(config: Partial<any>): Promise<any> {
    return this.connection
      .collection('configs')
      .findOneAndUpdate(
        {}, // Match the first document (update criteria, can be customized)
        { $set: config }, // Set the new configuration fields
        { returnDocument: 'after', upsert: true }, // Return the updated document, create if not found
      );
  }
}
