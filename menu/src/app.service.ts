import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Menu, MenuDocument } from './schemas/menu.schema';


@Injectable()
export class AppService {
  constructor(
    @InjectModel(Menu.name) private readonly menuModel: Model<MenuDocument>,
  ) {}

  // Create a new menu
  async create(createMenuDto: any): Promise<any> {
    const menu = new this.menuModel(createMenuDto);
    return menu.save();
  }

  // Get all menus without pagination (findAll without pagination)
  async findAllWithoutPagination(): Promise<any> {
    return this.menuModel.find().exec();
  }

  // Get all menus with pagination
  async findAll(page: number, limit: number, query: string): Promise<any> {
    const skip = (page - 1) * limit;
    const filter = query ? { label: new RegExp(query, 'i') } : {};

    const [results, total] = await Promise.all([
      this.menuModel.find(filter).skip(skip).limit(limit).exec(),
      this.menuModel.countDocuments(filter).exec(),
    ]);

    return {
      results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Find all menus by itemType
  async findByType(itemType: string): Promise<any> {
    const menus = await this.menuModel.find({ itemType }).exec();
    if (!menus || menus.length === 0) {
      throw new NotFoundException(`Menus with type ${itemType} not found`);
    }
    return menus;
  }

  // Find a menu by ID
  async findById(id: string): Promise<any> {
    const menu = await this.menuModel.findById(id).exec();
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return menu;
  }

  // Update a menu
  async update(id: string, updateMenuDto: any): Promise<any> {
    const updatedMenu = await this.menuModel
      .findByIdAndUpdate(id, updateMenuDto, { new: true })
      .exec();

    if (!updatedMenu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return updatedMenu;
  }

  // Delete a menu
  async delete(id: string): Promise<void> {
    const result = await this.menuModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
  }
  async findAllByPermissions(permissions: any):Promise<any> {
    return this.menuModel.find().lean().exec().then((menus) => {
      return menus.map(menu => {
        // Filter subItems based on permissions
        menu.subItems = menu.subItems.filter(subItem =>
          subItem.permissions.some(permission => permissions.includes(permission))
        );
        return menu;
      }).filter(menu => 
        menu.permissions.some(permission => permissions.includes(permission)) || menu.subItems.length > 0
      );
    });
  }
}
