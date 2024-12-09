import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Config } from '../schemas/config.schema'; // Import the Config schema

@Injectable()
export class ConfigService {
  constructor(@InjectModel(Config.name) private readonly configModel: Model<Config>) {}

  // Method to fetch the config data
  async getConfig() {
    return this.configModel.findOne(); // Fetching the first available config, or you can adjust the query
  }

  // Method to update the config
  async updateConfig(updatedData: Partial<Config>) {
    const config = await this.configModel.findOne();
    if (!config) {
      throw new Error('Config not found');
    }

    // Update specific fields
    Object.assign(config, updatedData);
    return config.save(); // Save updated config
  }
}
