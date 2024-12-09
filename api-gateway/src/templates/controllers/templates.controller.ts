import { Controller, Get, Param, Body } from '@nestjs/common';
import { TemplateDocumentService } from '../services/templates.services';

@Controller('documents')
export class DocumentController {
  constructor(private readonly templateDocumentService: TemplateDocumentService) {}

  @Get('generate/:type')
  async generateDocument(
    @Param('type') type: string,
    @Body() placeholders: Record<string, any>,
  ): Promise<any> {
    const document = await this.templateDocumentService.generateDocument(type, placeholders);
    return { document };
  }
}

