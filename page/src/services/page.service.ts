import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Page, PageDocument } from '../schemas/page.schema';

@Injectable()
export class PageService {

  constructor(
    @InjectModel(Page.name)
    private readonly pageModel: Model<PageDocument>,
  ) {}

  async create(createPageDto: Partial<any>): Promise<any> {
    const createdPage = new this.pageModel(createPageDto);
    return createdPage.save();
  }

  async findAll(page: number, limit: number, searchText: string):Promise<any> {
    try{
        let query = {};

        // Implementing search functionality
        if (searchText) {
          query = {
            $or: [
              { title: new RegExp(searchText, 'i') },
              { type: new RegExp(searchText, 'i') }
            ],
          };
        }

        const totalItems = await this.pageModel.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);
        const items = await this.pageModel
          .find(query)
          .populate('nestedComponents') // Populate nested components
          .skip((page - 1) * limit)
          .limit(limit)
          .exec();

        return {
          statusCode: 200,
          totalPages,
          rows: items,
          totalItems,
          currentPage: page
        };
    }catch(e){
      throw new Error(e.message)
    }
  }


  async findOne(id: any): Promise<any> {
    console.log(id, "here")
    const page = await this.pageModel
      .findOne({ type: id.type, linkUrl: id.route })
      .populate('nestedComponents') // Populate nested components
      .exec();
    if (!page) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }
    return page;
  }
  async findPageById(id: any): Promise<any> {
    
    const page = await this.pageModel
      .findOne({ _id: id })
      .populate('nestedComponents') // Populate nested components
      .exec();
    if (!page) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }
    return page;
  }
  async update(id: string, updatePageDto: Partial<any>): Promise<any> {
    const existingPage = await this.findOne(id);
    if (!existingPage) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }
    Object.assign(existingPage, updatePageDto);
    return existingPage.save();
  }

  async remove(id: string): Promise<any> {
    const page = await this.findOne(id);
    if (!page) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }
    return page.remove();
  }

  // Method to create a nested component
  async addNestedComponent(parentId: string, nestedComponentDto: Partial<any>): Promise<any> {
    const parentComponent = await this.findOne(parentId);
    const nestedComponent = new this.pageModel(nestedComponentDto);
    await nestedComponent.save();
    parentComponent.nestedComponents.push(nestedComponent);
    await parentComponent.save();
    return nestedComponent;
  }
}
  