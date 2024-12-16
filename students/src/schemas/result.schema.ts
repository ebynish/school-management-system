import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,  // Automatically adds createdAt and updatedAt fields
})
export class Result {
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId; // Reference to the student

  @Prop({ required: true })
  matricNumber: string; // Course code (e.g., "CSC301")

  @Prop({})
  sessionId: string; // Course code (e.g., "CSC301")

  @Prop({})
  semesterId: string; // Course code (e.g., "CSC301")

  @Prop({})
  departmentId: string; // Course code (e.g., "CSC301")

  @Prop({})
  levelId: string; // Course code (e.g., "CSC301")

  @Prop({ required: true })
  courseCode: string; // Course code (e.g., "CSC301")

  @Prop({ required: true })
  courseTitle: string; // Course title (e.g., "Object Oriented Programming")

  @Prop({ required: true })
  creditUnits: number; // Number of credit units for the course

  @Prop({ required: true })
  grade: string; // Grade obtained (e.g., "A", "B", "C")

  @Prop({ required: true })
  gradePoint: number; // Numeric grade point corresponding to the grade (e.g., 5.0 for A)

  @Prop({ required: true })
  score: number; // The actual score the student achieved in the course

  @Prop({ required: true })
  semester: string; // Semester in which the course was taken (e.g., "Semester 1")

  @Prop({ required: true })
  session: string; // Academic session (e.g., "2023/2024")

  @Prop({ required: true })
  level: string; 

  @Prop({ default: Date.now })
  createdAt: Date; // Date the result was created

  @Prop({ default: Date.now })
  updatedAt: Date; // Date the result was last updated
}

export type ResultDocument = Result & Document;
export const ResultSchema = SchemaFactory.createForClass(Result);
