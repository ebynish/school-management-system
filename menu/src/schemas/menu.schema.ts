import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MenuDocument = Menu & Document;

export enum ItemType {
  PAGE = 'page',
  TABLE = 'table',
  FORM = 'form',
  FORM_DETAILS = 'form_details',
  RECEIPT = 'receipt',
  REPORT = 'report',
  CARDS = 'cards'
}

@Schema()
export class SubItem {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  route: string;

  @Prop({ required: true, enum: ItemType })
  itemType: ItemType;

  @Prop({ type: [String], default: [] })
  permissions: string[]; // Array of permissions required to view this subitem
}

export const SubItemSchema = SchemaFactory.createForClass(SubItem);

@Schema()
export class Menu {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  icon: string;

  @Prop({ required: false })
  route: string;

  @Prop({ type: [SubItemSchema], default: [] })
  subItems: SubItem[];

  @Prop({ required: true, enum: ItemType })
  itemType: ItemType;

  @Prop({ type: [String], default: [] })
  permissions: string[]; // Array of permissions required to view this menu
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
