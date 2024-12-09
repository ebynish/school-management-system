import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { FormService } from './services/form.service';
import { Form } from './schemas/form.schema';

@Controller('forms')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post()
  async create(@Body() formData: Partial<Form>): Promise<Form> {
    return this.formService.create(formData);
  }

  @Get()
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<any> {
    // 
    // return this.formService.findAll(page, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Form> {
    return this.formService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() formData: Partial<Form>): Promise<Form> {
    return this.formService.update(id, formData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Form> {
    return this.formService.remove(id);
  }
}
