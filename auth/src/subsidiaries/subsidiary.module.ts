// subsidiaries/subsidiary.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subsidiary, SubsidiarySchema } from './schemas/subsidiary.schema';
import { SubsidiaryService } from './services/subsidiary.service';
import { SubsidiaryController } from './controllers/subsidiary.controllers';

@Module({
  imports: [MongooseModule.forFeature([{ name: Subsidiary.name, schema: SubsidiarySchema }])],
  providers: [SubsidiaryService],
  exports: [SubsidiaryService],
  controllers:[SubsidiaryController]
})
export class SubsidiaryModule {}
