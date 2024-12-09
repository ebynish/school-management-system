// company/company.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './schemas/company.schema';
import { CompanyService } from './services/company.service';
import { CompanyController } from './controllers/company.controllers';

@Module({
  imports: [MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }])],
  providers: [CompanyService],
  exports: [CompanyService],
  controllers: [CompanyController]
})
export class CompanyModule {}
