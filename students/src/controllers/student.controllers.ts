import { Controller, Post, Get, Param, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { StudentService } from '../services/student.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}
  
//   @MessagePattern()
//   async getAdmissionLetter(@Payload() payload:any): Promise<any> {
//     const letter = await this.studentService.generateAdmissionLetter(payload);
//     return { admissionLetter: letter };
//   }

//   @MessagePattern()
//   async addResults(
//     @Payload() payload:any){
//     const response = await this.studentService.addResults(payload);
//     return response;
//   }

  @MessagePattern()
  async getResultBySemester(@Payload() payload:any) {
    const response = await this.studentService.getResultBySemester(payload);
    return response;
  }

  // Get results by session for a student
  @MessagePattern()
  async getResultBySession(
    @Payload() payload:any) {
    const response = await this.studentService.getResultBySession(payload);
    return response;
  }

  @MessagePattern()
  async getTranscript(@Payload() payload:any) {
    const response = await this.studentService.getTranscript(payload);
    return response;
  }

  @MessagePattern()
  async calculateCGPA(@Payload() payload:any) {
    const response = await this.studentService.calculateCGPA(payload);
    return response;
  }

//   @MessagePattern()
//   async getResults(@Payload() payload:any): Promise<any> {
//     return await this.studentService.getResults(payload);
//   }

  @MessagePattern()
  async getCGPA(@Payload() payload:any): Promise<any> {
    const cgpa = await this.studentService.calculateCGPA(payload);
    return cgpa
  }
  
}
