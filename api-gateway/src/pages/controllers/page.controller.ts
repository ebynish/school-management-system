
import { Controller, Post, Body, Req, UnauthorizedException, Get, Query, Param, UseGuards } from '@nestjs/common';
import { PageClientService } from '../services/page.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('pages')
export class PageClientController {
  constructor(private pagesService: PageClientService) {}
  
  @UseGuards(JwtAuthGuard)
  @Get('')
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('q') searchText = ''
  ) {
    return this.pagesService.findAll(+page, +limit, searchText);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findPages(@Param('id') id: any) {
    return this.pagesService.findPages(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async create(@Body() pages: any) {
    try {
    return this.pagesService.createPage(pages)
    }catch(e){
      
      throw new Error(e.message)
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @Get(':parent/:slug')
  findPage(@Param('parent') parent: string, @Param('slug') slug: string) {
    return this.pagesService.findPages({ parent, slug });
  }

}

