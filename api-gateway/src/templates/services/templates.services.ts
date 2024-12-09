import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Template, TemplateDocument } from '../schemas/templates.schema';

@Injectable()
export class TemplateDocumentService {
  constructor(
    @InjectModel(Template.name) private templateModel: Model<TemplateDocument>,
  ) {}

  /**
   * Fetch a template by type from the database.
   * @param type - The type of document (e.g., 'admissionLetter', 'transcript', 'result').
   * @returns The template content.
   */
  async getTemplateByType(type: string): Promise<string> {
    const template = await this.templateModel.findOne({ type }).exec();
    if (!template) {
      throw new Error(`Template for type "${type}" not found`);
    }
    return template.content;
  }

  /**
   * Generate a document by replacing placeholders in the template with dynamic data.
   * @param type - The type of document (e.g., 'admissionLetter', 'transcript', 'result').
   * @param placeholders - A key-value map for dynamic replacements.
   * @returns The generated document as a string.
   */
  async generateDocument(type: string, placeholders: Record<string, any>): Promise<string> {
    // Fetch the template
    const template = await this.getTemplateByType(type);

    // Replace placeholders dynamically
    return this.replacePlaceholders(template, placeholders);
  }

  /**
   * Replace placeholders in a template string with dynamic data.
   * @param template - The template string containing placeholders (e.g., {{key}}).
   * @param data - A key-value map for dynamic replacements.
   * @returns The processed string with placeholders replaced.
   */
  private replacePlaceholders(template: string, data: Record<string, any>): string {
    return template.replace(/{{(.*?)}}/g, (_, key) => {
      const value = this.resolveNestedValue(data, key.trim());
      return value !== undefined && value !== null ? value : `{{${key}}}`; // Leave unresolved placeholders intact
    });
  }

  /**
   * Resolve nested keys in the placeholders (e.g., "student.name").
   * @param data - The object containing the dynamic data.
   * @param keyPath - The dot-separated key path (e.g., "student.name").
   * @returns The resolved value or undefined.
   */
  private resolveNestedValue(data: Record<string, any>, keyPath: string): any {
    return keyPath.split('.').reduce((acc, key) => acc && acc[key], data);
  }
}
