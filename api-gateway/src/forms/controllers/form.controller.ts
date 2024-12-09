
import { Controller, Post, Body, Req, UnauthorizedException, Get, Query, Param, UseGuards } from '@nestjs/common';
import { FormClientService } from '../services/form.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserOne } from 'src/auth/decorators/user.decorator';
import { ObjectId } from 'mongoose';

// @UseGuards(JwtAuthGuard)
@Controller('forms')
export class FormClientController {
  constructor(private formsService: FormClientService) {}

  
  @Post('submit')
  async submit(@UserOne('_id') id: ObjectId, @Body() forms: any) {
    try {
      console.log('here')
    return await this.formsService.submitForm({ data: forms, userId: id})
    }catch(e){
      console.log(e)
      throw new Error(e.message)
    }
  }

  
  @Post('update-status')
  async updateStatus(@UserOne('_id') userId: ObjectId, @Body() forms: any) {
    try {
      console.log(forms)
      forms.userId =userId;
    return this.formsService.updateStatus(forms)
    }catch(e){
      console.log(e)
      throw new Error(e.message)
    }
  }

  
  @Get(':id')
  async findForms(@Param('id') id: string) {
    if(id.includes("-"))
      return await this.formsService.findFormsBySlug(id);
    else
      return await this.formsService.findForms(id);
  }
  
  
  @Get('')
  findAll(
    @UserOne('_id') userId: ObjectId,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('q') searchText = ''
  ) {
    return this.formsService.findAll(+page, +limit, searchText);
  }


  // @UseGuards(JwtAuthGuard)
  @Post('')
  async create(@Body() forms: any) {
    try {
    return this.formsService.createForm(forms)
    }catch(e){
      console.log(e)
      throw new Error(e.message)
    }
  }
}

