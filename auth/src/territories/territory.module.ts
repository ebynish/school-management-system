// territories/territory.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Territory, TerritorySchema } from './schemas/territory.schema';
import { TerritoryService } from './services/territory.service';
import { TerritoryController } from './controllers/territories.controllers';
import { BranchService } from 'src/branch/services/branch.service';
import { Branch, BranchSchema } from 'src/branch/schemas/branch.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Territory.name, schema: TerritorySchema },
    { name: Branch.name, schema: BranchSchema },
  ])],
  providers: [TerritoryService, BranchService],
  exports: [TerritoryService],
  controllers: [TerritoryController]
})
export class TerritoryModule {}
