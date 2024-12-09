// src/email/controllers/configuration.controller.ts
import { Controller, Get, Patch, Body } from '@nestjs/common';
import { ConfigurationService } from '../services/config.services';


@Controller('configurations')
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  @Get()
  async getConfiguration(): Promise<any> {
    return this.configurationService.getConfiguration();
  }

  @Patch()
  async updateConfiguration(@Body() config: Partial<any>): Promise<any> {
    return this.configurationService.updateConfiguration(config);
  }
}
