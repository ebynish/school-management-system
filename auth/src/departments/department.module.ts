// Departments/Department.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DepartmentController } from './controllers/department.controllers';
import { Department, DepartmentSchema } from './schemas/department.schema';
import { DepartmentService } from './services/department.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Department.name, schema: DepartmentSchema }])],
  providers: [DepartmentService],
  controllers: [DepartmentController],
  exports: [DepartmentService],
})
export class DepartmentModule {}
