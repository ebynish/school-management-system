import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class RegisteredCourse {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId; // Reference to the student who registered for the course

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId; // Reference to the course being registered

  @Prop({ required: true })
  courseCode: string; // Course code (e.g., "CSC101")

  @Prop({ required: true })
  courseTitle: string; // Course title (e.g., "Introduction to Computer Science")

  @Prop({ required: true })
  semester: string; // The semester in which the course is being registered (e.g., "Semester 1")

  @Prop({ required: true })
  session: string; // The academic session for the registration (e.g., "2023/2024")

  @Prop({ required: true })
  registrationDate: Date; // Date of course registration

  @Prop({ default: false })
  isPaid: boolean; // Whether the student has paid for the course

  @Prop({ default: Date.now })
  createdAt: Date; // When the registration was created

  @Prop({ default: Date.now })
  updatedAt: Date; // When the registration was last updated
}

export type RegisteredCourseDocument = RegisteredCourse & Document;
export const RegisteredCourseSchema = SchemaFactory.createForClass(RegisteredCourse);
