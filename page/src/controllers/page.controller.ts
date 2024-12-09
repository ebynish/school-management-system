import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { PageService } from '../services/page.service';
import { Page } from '../schemas/page.schema';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class PageController {
  constructor(private readonly pageService: PageService) {}

  // @Get()
  // findAll() {
  //   return this.pageService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.pageService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePageDto: Partial<Page>) {
  //   return this.pageService.update(id, updatePageDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.pageService.remove(id);
  // }

  // @Post(':id/nested')
  // addNestedComponent(@Param('id') parentId: string, @Body() nestedComponentDto: Partial<Page>) {
  //   return this.pageService.addNestedComponent(parentId, nestedComponentDto);
  // }
  @MessagePattern({ cmd: 'create-page' })
  async create(@Payload() data: any) {
    
    const page = await this.pageService.create(data)
    
    return page
  }
 
  @MessagePattern({ cmd: 'get-pages' })
  async getPages(@Payload() data: any) {
    const page = await this.pageService.findAll(data?.page, data?.limit, data?.searchText);
    return page
  }

  @MessagePattern({ cmd: 'get-page' })
  async getPageById(@Payload() data: any) {
    
     const page = await this.pageService.findOne(data)
    
    return page
  }


}
