import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Define the Option schema
@Schema()
export class Option {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  value: string;
}

// Create the Mongoose schema for Option
export const OptionSchema = SchemaFactory.createForClass(Option);

// Define the Field schema
@Schema()
export class Field {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string; // Field type (e.g., 'field', 'section')

  @Prop({ required: false })
  inputType?: string; // Input type for fields (e.g., 'text', 'checkbox')

  @Prop({ required: false, default: false })
  isRequired?: boolean; // Is the field required?

  @Prop({ required: false, default: false })
  isActive?: boolean; // Optional field to mark if a field is active

  @Prop({ type: [OptionSchema], required: false }) // Hold an array of Option objects for select input type
  options?: Option[]; // Options for fields like dropdowns

  @Prop({ type: [], required: false }) // Use FieldSchema for nesting fields
  fields?: Field[]; // Nested fields for sections
}

// Create the Mongoose schema for Field
export const FieldSchema = SchemaFactory.createForClass(Field);

// Define the Section schema
@Schema()
export class Section {
  @Prop({ required: true })
  title: string; // Title of the section

  @Prop({ type: [], required: true }) // Array of fields within the section
  fields: [];
}

// Create the Mongoose schema for Section
export const SectionSchema = SchemaFactory.createForClass(Section);

// Define the Form schema
@Schema()
export class Form {
  @Prop({ required: true, unique: true })
  title: string; // Title for the form

  @Prop({ type: String, required: true}) // To handle form steps, default to null
  slug: string;

  @Prop({ type: [SectionSchema], required: true }) // Array of sections in the form
  sections: Section[];

  @Prop({}) // To handle form steps, default to null
  step: string;

  @Prop({ default: false }) // To handle form steps, default to null
  isActive: boolean;

  @Prop({ default: false }) // To handle form steps, default to null
  approve: boolean;

  @Prop({ default: false }) // To handle form steps, default to null
  notification: boolean;

  @Prop({ type: String, required: true}) 
  schema: string;

  @Prop({ type: String}) 
  integration: string;

  @Prop({ type: String}) 
  dependency: string;
  
  @Prop({ type: Types.ObjectId, ref: 'ApprovalRule' })
  approvalRule: Types.ObjectId; // The approval rule for this form (mapped to an approval process)

}

// Create the Mongoose schema for Form
export const FormSchema = SchemaFactory.createForClass(Form);

// Export the document types
export type FormDocument = Form & Document;
export type SectionDocument = Section & Document;
export type FieldDocument = Field & Document;
export type OptionDocument = Option & Document;
