import { Controller, Post, Get, Param, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { StudentService } from '../services/student.service';
import { FileInterceptor } from '@nestjs/platform-express';
// import * as multer from 'multer';
// import * as xlsx from 'xlsx';
import { diskStorage } from 'multer';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}
  @Get('admission-letter/:applicantId')
  async getAdmissionLetter(@Param('applicantNumber') applicantNumber: string): Promise<any> {
    const letter = await this.studentService.generateAdmissionLetter(applicantNumber);
    return { admissionLetter: letter };
  }


  // Get results by semester for a student
  @Get(':studentId/results/semester/:semester')
  async getResultBySemester(
    @Param('studentId') studentId: string,
    @Param('semester') semester: string,
  ) {
    const response = await this.studentService.getResultBySemester(
      studentId,
      semester,
    );
    return response;
  }

  // Get results by session for a student
  @Get(':studentId/results/session/:session')
  async getResultBySession(
    @Param('studentId') studentId: string,
    @Param('session') session: string,
  ) {
    const response = await this.studentService.getResultBySession(
      studentId,
      session,
    );
    return response;
  }

  // Get the transcript of a student
  @Get(':studentId/transcript')
  async getTranscript(@Param('studentId') studentId: string) {
    const response = await this.studentService.getTranscript(studentId);
    return response;
  }

  // Calculate CGPA for a student
  @Get(':studentId/cgpa')
  async calculateCGPA(@Param('studentId') studentId: string) {
    const response = await this.studentService.calculateCGPA(studentId);
    return response;
  }

  @Get('student/:studentId')
  async getResults(@Param('studentId') studentId: string): Promise<any> {
    return await this.studentService.getResults(studentId);
  }

  @Get('student/:studentId/cgpa')
  async getCGPA(@Param('studentId') studentId: string): Promise<any> {
    const cgpa = await this.studentService.calculateCGPA(studentId);
    return { studentId, cgpa };
  }
  @Post('upload-scores')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Directory to store the file
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  async uploadStudentScores(@UploadedFile() file: Express.Multer.File): Promise<any> {
    // Process the file
    return await this.studentService.processUploadedScores(file.path);
  }
}
