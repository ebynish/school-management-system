import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true
  })
export class Student {

  @Prop({ required: true })
  name: string; // Full name of the student

  @Prop({})
  dateOfBirth: string; // Full name of the student

  @Prop({ required: true })
  programme: string; // Program the student is enrolled in (e.g., "B.Sc. Computer Science")

  @Prop({ required: true })
  campus: string; // Program the student is enrolled in (e.g., "B.Sc. Computer Science")

  @Prop({ required: true })
  email: string; // Student's email address

  @Prop({ required: true })
  phoneNumber: string; // Student's phone number

  @Prop({ required: true, unique: true })
  matricNumber: string; // Matriculation number for the student (e.g., UOE-CS-2024-0001)

  @Prop({ required: true })
  schoolCode: string; // The school code (e.g., "UOE")

  @Prop({ required: true })
  departmentCode: string; // The department code (e.g., "CS")

  @Prop({ required: true })
  session: string; // The academic session (e.g., "2024/2025")

}

export type StudentDocument = Student & Document;
export const StudentSchema = SchemaFactory.createForClass(Student);
