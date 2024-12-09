import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Connection } from 'mongoose';
import { Student, StudentDocument } from '../schemas/student.schema';
import { Result, ResultDocument } from '../schemas/result.schema';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class StudentService {
  private applicantsCollection;
  private gradePointsCollection;

  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Result.name) private resultModel: Model<ResultDocument>,
    private readonly connection: Connection,
    private readonly paymentService: any,
    private clientUser: ClientProxy
  ) {
    this.clientUser = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'localhost', port: 3002 },
    });

    // Access the "applicants" collection directly
    this.applicantsCollection = this.connection.collection('applicants');
    // Access the "grades" collection directly
    this.gradePointsCollection = this.connection.collection('grades');
  }

  // Fetch user data from another microservice
  async getUser(userId: any) {
    return await firstValueFrom(this.clientUser.send({ cmd: 'find-user' }, userId));
  }

  // Create user in a separate service (e.g., Authentication service)
  async createUser(user: any) {
    try {
      const result = await firstValueFrom(this.clientUser.send({ cmd: 'create-user' }, user));
      return { statusCode: 200, message: 'User created successfully', data: result };
    } catch (error) {
      console.error('Error creating user:', error);
      return { statusCode: 500, message: 'Failed to create user', error: error.message };
    }
  }

  // Generate matriculation number
  async generateMatricNumber(schoolCode: string, departmentCode: string, session: string): Promise<any> {
    try {
      const lastStudent = await this.studentModel
        .findOne({ schoolCode, departmentCode, session })
        .sort({ matricNumber: -1 })
        .exec();

      let lastNumber = lastStudent ? parseInt(lastStudent.matricNumber.split('-')[3], 10) : 0;
      lastNumber += 1;

      return { statusCode: 200, message: 'Matriculation number generated successfully', matricNumber: `${schoolCode}/${departmentCode}/${session}/${lastNumber.toString().padStart(4, '0')}` };
    } catch (error) {
      console.error('Error generating matric number:', error);
      return { statusCode: 500, message: 'Failed to generate matric number', error: error.message };
    }
  }

  // Create a new student record
  async createStudent(studentData: any): Promise<any> {
    try {
      const matricNumberResponse = await this.generateMatricNumber(
        studentData.schoolCode,
        studentData.departmentCode,
        studentData.session,
      );

      if (matricNumberResponse.statusCode !== 200) {
        throw new Error(matricNumberResponse.message);
      }

      const matricNumber = matricNumberResponse.matricNumber;
      const newStudent = await this.createUser({
        ...studentData,
        matricNumber,
        username: matricNumber,
      });

      return newStudent;
    } catch (error) {
      console.error('Error creating student:', error);
      return { statusCode: 500, message: 'Failed to create student', error: error.message };
    }
  }

  // Process manual payment and create student
  async processManualPayment(paymentInfo: { applicantId: string; paymentAmount: number }): Promise<any> {
    try {
      const applicant = await this.applicantsCollection.findOne({ applicantId: paymentInfo.applicantId });
      if (!applicant) {
        throw new Error('Applicant not found');
      }

      await this.applicantsCollection.updateOne(
        { applicantId: paymentInfo.applicantId },
        { $set: { paymentStatus: true } },
      );

      const student = await this.createStudent({
        studentId: applicant.applicantId,
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        programme: applicant.programme,
        password: 'default',
        email: applicant.email,
        phoneNumber: applicant.phoneNumber,
        role: new mongoose.Types.ObjectId('658cb0e28f6a90879cb71f6f'),
        campusId: applicant.campus,
        department: applicant.department,
        level: applicant.level,
        session: applicant.session,
        paymentStatus: 'Paid',
        paymentAmount: paymentInfo.paymentAmount,
      });

      return { statusCode: 200, message: 'Student successfully created', student };
    } catch (error) {
      console.error('Error processing manual payment:', error);
      return { statusCode: 500, message: 'Failed to process manual payment', error: error.message };
    }
  }

  // Determine grade and grade point based on score
  async determineGrade(score: number): Promise<any> {
    let gradeScale = await this.gradePointsCollection.findOne({});

    for (const scale of gradeScale) {
      if (score >= scale.min && score <= scale.max) {
        return { grade: scale.grade, gradePoint: scale.gradePoint };
      }
    }
    return { grade: 'F', gradePoint: 0.0 }; // Default to "F" if no match is found
  }

  // Add results for a student
  async addResults(studentId: string, results: any[]): Promise<any> {
    try {
      const student = await this.studentModel.findById(studentId).exec();
      if (!student) {
        throw new Error('Student not found');
      }

      // Process the results and determine grades asynchronously
      const newResults = await Promise.all(
        results.map(async (result) => {
          const { grade, gradePoint } = await this.determineGrade(result.score); // Determine grade and grade point asynchronously
          return {
            ...result,
            grade,
            gradePoint,
            studentId,
          };
        })
      );

      // Insert the new results into the database
      await this.resultModel.insertMany(newResults);

      return { statusCode: 200, message: 'Results added successfully', results: newResults };
    } catch (error) {
      console.error('Error adding results:', error);
      return { statusCode: 500, message: 'Failed to add results', error: error.message };
    }
  }

  // Get results for a student by semester
  async getResultBySemester(payload: any): Promise<any> {
    try {
      let {studentId, semester} = payload;
      const results = await this.resultModel.find({ studentId, semester }).exec();
      if (results.length === 0) {
        return { statusCode: 404, message: 'No results found for this semester' };
      }

      return { statusCode: 200, message: 'Results retrieved successfully', results };
    } catch (error) {
      console.error('Error retrieving results by semester:', error);
      return { statusCode: 500, message: 'Failed to retrieve results by semester', error: error.message };
    }
  }

    // Get results for a student by session
    async getResultBySession(payload:any): Promise<any> {
      try {
        let {studentId, session} = payload;
        const results = await this.resultModel.find({ studentId, session }).exec();
        if (results.length === 0) {
          return { statusCode: 404, message: 'No results found for this session' };
        }

        return { statusCode: 200, message: 'Results retrieved successfully', results };
      } catch (error) {
        console.error('Error retrieving results by session:', error);
        return { statusCode: 500, message: 'Failed to retrieve results by session', error: error.message };
      }
    }

    // Get student's transcript (results grouped by semester)
  // Get student's transcript (results grouped by semester and session)
  async getTranscript(studentId: string): Promise<any> {
    try {
      const results = await this.resultModel.find({ studentId }).exec();

      if (results.length === 0) {
        return { statusCode: 404, message: 'No results found for this student' };
      }

      // Group results by session and semester
      const groupedResults = results.reduce((acc, result) => {
        const { semester, session } = result;

        // Initialize session group if not exist
        if (!acc[session]) {
          acc[session] = {};
        }

        // Initialize semester group for each session if not exist
        if (!acc[session][semester]) {
          acc[session][semester] = [];
        }

        // Push the result to the appropriate session and semester group
        acc[session][semester].push(result);
        return acc;
      }, {});

      // Calculate SGPA for each semester and CGPA for the entire period
      let totalCreditPoints = 0;
      let totalCreditUnits = 0;
      let semesterResults = {};

      // Calculate SGPA per semester and accumulate for CGPA
      for (const session in groupedResults) {
        for (const semester in groupedResults[session]) {
          const semesterData = groupedResults[session][semester];

          let semesterCreditPoints = 0;
          let semesterCreditUnits = 0;

          // Calculate credit points and units for the current semester
          semesterData.forEach((result) => {
            semesterCreditPoints += result.gradePoint * result.creditUnits;
            semesterCreditUnits += result.creditUnits;
          });

          const semesterSGPA = semesterCreditUnits > 0
            ? semesterCreditPoints / semesterCreditUnits
            : 0;

          // Store the semester SGPA
          if (!semesterResults[session]) {
            semesterResults[session] = {};
          }
          semesterResults[session][semester] = {
            results: semesterData,
            SGPA: semesterSGPA,
          };

          // Accumulate for total CGPA
          totalCreditPoints += semesterCreditPoints;
          totalCreditUnits += semesterCreditUnits;
        }
      }

      // Calculate the total CGPA across all semesters and sessions
      const totalCGPA = totalCreditUnits > 0 ? totalCreditPoints / totalCreditUnits : 0;

      return {
        statusCode: 200,
        message: 'Transcript generated successfully',
        transcript: semesterResults,
        totalCGPA: totalCGPA.toFixed(2), // Return the CGPA with 2 decimal places
      };
    } catch (error) {
      console.error('Error generating transcript:', error);
      return { statusCode: 500, message: 'Failed to generate transcript', error: error.message };
    }
}

  // Calculate CGPA for a student
  async calculateCGPA(studentId: string): Promise<any> {
    try {
      const results = await this.resultModel.find({ studentId }).exec();
      if (results.length === 0) {
        return { statusCode: 200, message: 'No results available', cgpa: 0 };
      }

      let totalCreditPoints = 0;
      let totalCreditUnits = 0;

      for (const result of results) {
        totalCreditPoints += result.gradePoint * result.creditUnits;
        totalCreditUnits += result.creditUnits;
      }

      const cgpa = totalCreditUnits > 0 ? totalCreditPoints / totalCreditUnits : 0;

      return {
        statusCode: 200,
        message: 'CGPA calculated successfully',
        cgpa,
      };
    } catch (error) {
      console.error('Error calculating CGPA:', error);
      return { statusCode: 500, message: 'Failed to calculate CGPA', error: error.message };
    }
  }
}
