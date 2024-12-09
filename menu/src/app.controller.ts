import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return "";
  }

  @MessagePattern({ cmd: 'get-menu' })
  async getMenu(@Payload() data: any) {
    console.log(data)
    let page = data?.page;
    let limit = data?.limit;
    let searchText = data?.searchText;

    const menu = await this.appService.findAll(page, limit, searchText);
    return menu
  }

  @MessagePattern({ cmd: 'find-menu' })
  async findMenu() {
    
    const menu = await this.appService.findAllWithoutPagination();
    
    return menu
  }
}
