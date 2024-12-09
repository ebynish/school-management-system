import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { PageClientService } from './pages/services/page.service';
import { FormClientService } from './forms/services/form.service';
import { ConfigService } from './config/services/config.service';
import { AppService } from './app.service';
import { AuthClientService } from './auth/services/auth.service';


@Controller()
export class AppController {
  constructor(private readonly pageService: PageClientService,
    private readonly formService: FormClientService,
    private readonly configService: ConfigService,
    private readonly appService: AppService,
    private readonly authService: AuthClientService
    ) {}

  @Post('applicants/login')
  async login(@Body() forms: any) {
    return await this.appService.applicantLogin(forms)
  }

  @Post('generateInvoice')
  async generateInvoice(@Body() forms: any) {
    return await this.formService.generateInvoice(forms)
  }

  @Post('applicants/status')
  async status(@Body() forms: any) {
    return await this.appService.applicantStatus(forms)
  }

  @Get('programmes-with-departments')
  async getProgrammesWithDepartments() {
    return  await this.appService.getProgrammesDepartments();
  }

    @Get('config')
    async getConfig():Promise<any>{
      return await this.configService.getConfig();
    }
    
    @Get('check/*')
    async findPage(@Param() params: any, @Query('s') status = '') {
      const fullPath = params['0']; // Capture everything after 'check/' as a single string
  
      // Split fullPath by `/` to get the individual segments
      const segments = fullPath.split('/');
      
      const type = segments[0];
      const route = segments[1];
      const route2 = segments[2];
      const route3 = segments[3];
      
      // Create combinedRoute based on the presence of route2
      const combinedRoute = route2 ? `${route}/${route2}` : route;
    
      // Fetch the result based on the type
      let result = type === "forms" 
        ? await this.formService.findForms(route) :
        type === "find" 
        ? await this.formService.findData(route, route2, route3, status ? status?.split("?q")[0]: null) 
        : type == "summary" ? await this.formService.getSummary(route, route2) 
        : await this.pageService.findPages({ type, route: combinedRoute });
      
      return result;
    }

    @Post('update/*')
    async update(@Param() params: any, @Body() forms: any) {
      const fullPath = params['0']; // Capture everything after 'check/' as a single string
      console.log(fullPath)
      // Split fullPath by `/` to get the individual segments
      const segments = fullPath.split('/');
      const route = segments[0];
      const route2 = segments[1];
      
      let result = await this.formService.update(route, route2, forms);
      
      
      if (result?.statusCode == 200 && forms?.type?.includes("Acceptance")){
        await this.authService.registerStudent(route2)
        return { statusCode: 200, message: 'Print your admission letter'};
      } else if (result?.statusCode == 200 && forms?.type?.includes("Application") && forms?.status == "Admitted"){
        let newData = await this.formService.findData("departments", forms?.department, "_id", null);
        
        await this.formService.update(route, route2, { courseId: forms?.department, courseName: newData[0]?.name, courseCode: newData[0]?.code})
      }
     return result
    }

    // @UseGuards(JwtAuthGuard)
    @Get('getWorkFlow/:id')
    async getWorkFlow(
      @Param('id') id: string,
      
    ) {
      console.log(id)
        return await this.formService.getWorkFlow(id);
    }

    // @UseGuards(JwtAuthGuard)
    @Get('update-stage/:id')
    async updateStage(
      @Param('id') id: string,
      @Body() payload: any) {
        payload.workflowId = id;
        return await this.formService.updateStatus(payload);
    }

    // @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findAll(
      @Param('id') type: string,
      @Query('populate') populate: string,
      @Query('page') page = 1,
      @Query('limit') limit = 10,
      @Query('q') searchText = '',
      @Query('s') status = ''
    ) {
      let pfield;
      if(populate)
        pfield = populate.split("?q")[0]
      if (status)
        return await this.formService.findByStatus(type, page, limit, searchText, status, null, null, pfield);
      else
        return await this.formService.findTable(type, page, limit, searchText, null, null, pfield);
    }
    @Get('fetch/:type/:id')
    async find(
      @Param('type') type: string,
      @Param('id') id: string,
      @Query('populate') populate: string,
      @Query('page') page = 1,
      @Query('limit') limit = 10,
      @Query('q') searchText = '',
      @Query('s') status = '',
      @Query('m') mode = ''
    ) {
      let pfield;
      if(populate)
        pfield = populate.split("?q")[0]
      if (status)
        return await this.formService.findByStatus(type, page, limit, searchText, status, id, mode, pfield);
      else
        return await this.formService.findTable(type, page, limit, searchText, id, mode, pfield);
    }
    
}
