import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Connection } from 'mongoose';
import { Result, ResultDocument } from '../schemas/result.schema';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class StudentService {
  private clientUser: ClientProxy
  private applicantsCollection;
  private gradePointsCollection;
  private studentCollections;

  constructor(
    @InjectModel(Result.name) private resultModel: Model<ResultDocument>,
    @InjectConnection() private readonly connection: Connection
  ) {
    this.clientUser = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'localhost', port: Number(process.env.AUTH_PORT_EXTERNAL) },
    });

    // Access the "applicants", "grades", and "users" collections directly
    this.applicantsCollection = this.connection.collection('applicants');
    this.gradePointsCollection = this.connection.collection('grades');
    this.studentCollections = this.connection.collection('users');
  }

  // Fetch user data from another microservice
  async getUser(userId: any) {
    try {
      return await firstValueFrom(this.clientUser.send({ cmd: 'find-user' }, userId));
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw new Error('Failed to fetch user data');
    }
  }

  // Create user in a separate service (e.g., Authentication service)
  async createUser(user: any) {
    try {
      const result = await firstValueFrom(this.clientUser.send({ cmd: 'create-user' }, user));
      return { statusCode: 200, message: 'User created successfully', data: result };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  // Generate matriculation number
  async generateMatricNumber(schoolCode: string, departmentCode: string, session: string): Promise<any> {
    try {
      const lastStudent = await this.studentCollections
        .findOne({ schoolCode, departmentCode, session })
        .sort({ matricNumber: -1 })
        .exec();

      let lastNumber = lastStudent ? parseInt(lastStudent.matricNumber.split('-')[3], 10) : 0;
      lastNumber += 1;

      return {
        statusCode: 200,
        message: 'Matriculation number generated successfully',
        matricNumber: `${schoolCode}/${departmentCode}/${session}/${lastNumber.toString().padStart(4, '0')}`,
      };
    } catch (error) {
      console.error('Error generating matric number:', error);
      throw new Error('Failed to generate matric number');
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
      throw new Error('Failed to create student');
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
      throw new Error('Failed to process manual payment');
    }
  }

  async determineGrade(score: number): Promise<any> {
    try {
      const gradeScale = await this.gradePointsCollection.find({}).toArray();
      console.log(score, "js");
  
      for (const scale of gradeScale) {

        let minScore = Number(scale.minScore);
        let maxScore = Number(scale.maxScore);
        let currentScore = Number(score);
        console.log(minScore, maxScore, currentScore, gradeScale)
        if (currentScore >= minScore && currentScore <= maxScore) {
          return { grade: scale.grade, gradePoint: scale.gradePoint };
        }
      }
  
      return { grade: 'F', gradePoint: 0.0 }; // Default to "F" if no match is found
    } catch (error) {
      console.error('Error determining grade:', error);
      throw new Error('Failed to determine grade');
    }
  }
  

  // Add results for a student
  async addResults(data: any): Promise<any> {
    try {
    
      let {extractedData, payload} = await data;
     
    let results = extractedData;


      // Process the results and determine grades asynchronously
      const newResults = await Promise.all(
        results.map(async (result) => {
          const student = await this.studentCollections.findOne({ matricNumber: result.matricNumber });
  
          const { grade, gradePoint } = await this.determineGrade(result.score); // Determine grade and grade point asynchronously
          if (student)
            return {
              ...result,
              grade,
              gradePoint,
              studentId: student?._id,
              ...payload
            };
        })
      );

      // Insert the new results into the database
      await this.resultModel.insertMany(newResults);

      return { statusCode: 200, message: 'Results added successfully', results: newResults };
    } catch (error) {
      console.error('Error adding results:', error);
      throw new Error('Failed to add results');
    }
  }

  // Get results for a student by semester
  async getResultBySemester(payload: any): Promise<any> {
    try {
      let { studentId, semester } = payload;
      const results = await this.resultModel.find({ studentId, semester }).exec();
      if (results.length === 0) {
        return { statusCode: 404, message: 'No results found for this semester' };
      }

      return { statusCode: 200, message: 'Results retrieved successfully', results };
    } catch (error) {
      console.error('Error retrieving results by semester:', error);
      throw new Error('Failed to retrieve results by semester');
    }
  }

  // Get results for a student by session
  async getResultBySession(payload: any): Promise<any> {
    try {
      let { studentId, session } = payload;
      const results = await this.resultModel.find({ studentId, session }).exec();
      if (results.length === 0) {
        return { statusCode: 404, message: 'No results found for this session' };
      }

      return { statusCode: 200, message: 'Results retrieved successfully', results };
    } catch (error) {
      console.error('Error retrieving results by session:', error);
      throw new Error('Failed to retrieve results by session');
    }
  }

  // Get student's transcript (results grouped by semester)
  async getTranscript(studentId: string): Promise<any> {
    try {
      const results = await this.resultModel.find({ studentId }).exec();

      if (results.length === 0) {
        return { statusCode: 404, message: 'No results found for this student' };
      }

      // Group results by session and semester
      const groupedResults = results.reduce((acc, result) => {
        const { semester, session } = result;
        if (!acc[session]) acc[session] = {};
        if (!acc[session][semester]) acc[session][semester] = [];
        acc[session][semester].push(result);
        return acc;
      }, {});

      // Calculate SGPA and CGPA for each session
      const transcript = Object.keys(groupedResults).map((session) => {
        const semesters = groupedResults[session];
        let totalGradePoints = 0;
        let totalUnits = 0;

        // Calculate SGPA for each semester
        const sessions = Object.keys(semesters).map((semester) => {
          const results = semesters[semester];
          const semesterTotal = results.reduce(
            (acc, result) => {
              totalGradePoints += result.gradePoint * result.units;
              totalUnits += result.units;
              return acc + result.gradePoint * result.units;
            },
            0,
          );

          const sgpa = (semesterTotal / totalUnits).toFixed(2);
          return { semester, results, sgpa };
        });

        const cgpa = (totalGradePoints / totalUnits).toFixed(2);
        return { session, sessions, cgpa };
      });

      return { statusCode: 200, message: 'Transcript retrieved successfully', transcript };
    } catch (error) {
      console.error('Error retrieving transcript:', error);
      throw new Error('Failed to retrieve transcript');
    }
  }
  async calculateCGPA(studentId: string): Promise<any> {
    try {
      const results = await this.resultModel.find({ studentId }).exec();
  
      if (results.length === 0) {
        return { statusCode: 404, message: 'No results found for this student' };
      }
  
      let totalGradePoints = 0;
      let totalUnits = 0;
  
      results.forEach(result => {
        totalGradePoints += result.gradePoint * result.creditUnits;
        totalUnits += result.creditUnits;
      });
  
      const cgpa = (totalGradePoints / totalUnits).toFixed(2);
  
      return { statusCode: 200, message: 'CGPA calculated successfully', cgpa };
    } catch (error) {
      console.error('Error calculating CGPA:', error);
      throw new Error('Failed to calculate CGPA');
    }
  }
  
}
