import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectConnection() private readonly connection: Connection, // Inject the Mongoose connection
  ) {}

  async getProgrammesWithDepartments(): Promise<any> {
    try {
      // Access the 'departments' collection directly using connection.collections
      const result = await this.connection
        .collection('departments') // Reference the 'departments' collection
        .aggregate([
          {
            $lookup: {
              from: 'programmes', // Reference the 'programmes' collection
              localField: 'programme', // The field in 'departments' that references 'programmes'
              foreignField: '_id', // The field in 'programmes' collection to match with
              as: 'programmeDetails', // The alias for the resulting 'programme' object
            },
          },
          {
            $unwind: {
              path: '$programmeDetails', // Unwind the 'programmeDetails' array to make it a single object
              preserveNullAndEmptyArrays: true, // Keep departments even if there's no match in programmes
            },
          },
          {
            $group: {
              _id: '$programme', // Group by programme _id (this assumes the 'programme' field is an ObjectId)
              programmeDetails: { $first: '$programmeDetails' }, // Include programme details (using $first since we've already unwound)
              departments: {
                $push: {
                  _id: '$_id',
                  name: '$name',
                  code: '$code',
                  hod: '$hod',
                  campus: '$campus',
                  status: '$status',
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              programme: {
                _id: '$programmeDetails._id',
                name: '$programmeDetails.name',
                code: '$programmeDetails.code',
                duration: '$programmeDetails.duration',
                requirements: '$programmeDetails.requirements',
              },
              departments: 1, // Include departments array in the output
            },
          },
        ])
        .toArray(); // Convert the aggregation cursor to an array

      console.log('Aggregation result:', JSON.stringify(result)); // Log the result to inspect the data

      return result; // Return the result of the aggregation
    } catch (err) {
      console.error('Error during aggregation:', err); // Log any errors for debugging
      throw new Error('Error occurred while fetching programmes with departments');
    }
  }

  async getProgrammesDepartments(): Promise<any> {
    try {
      // Access the 'programmes' collection and perform a lookup for related 'departments'
      const result = await this.connection
        .collection('programmes') // Reference the 'programmes' collection
        .aggregate([
          {
            $lookup: {
              from: 'departments', // Reference the 'departments' collection
              localField: '_id', // The field in 'programmes' that will match with 'departments'
              foreignField: 'programmes', // The field in 'departments' that references 'programmes'
              as: 'departmentsDetails', // The alias for the resulting 'departments' array
            },
          },
          {
            $unwind: {
              path: '$departmentsDetails', // Unwind the departments array to make it a single object
              // preserveNullAndEmptyArrays: true, // Keep programmes even if there's no matching department
            },
          },
          {
            $group: {
              _id: '$_id', // Group by programme _id (this assumes the '_id' is unique in programmes)
              programmeDetails: { $first: '$$ROOT' }, // Include the full programme document
              departments: {
                $push: {
                  _id: '$departmentsDetails._id',
                  name: '$departmentsDetails.name',
                  code: '$departmentsDetails.code',
                  hod: '$departmentsDetails.hod',
                  campus: '$departmentsDetails.campus',
                  status: '$departmentsDetails.status',
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              programme: {
                _id: '$programmeDetails._id',
                name: '$programmeDetails.name',
                amount: '$programmeDetails.amount',
                code: '$programmeDetails.code',
                duration: '$programmeDetails.duration',
                requirements: '$programmeDetails.requirements',
              },
              departments: 1, // Include departments array in the output
            },
          },
        ])
        .toArray(); // Convert the aggregation cursor to an array

      

      return result; // Return the result of the aggregation
    } catch (err) {
      console.error('Error during aggregation:', err); // Log any errors for debugging
      throw new Error('Error occurred while fetching programmes with departments');
    }
  }
  getHello(): string {
    return 'Hello World!';
  }
  async applicantLogin(forms: any): Promise<any> {
    const { applicantId, password } = forms;
  
    try {
      
      const applicant = await this.connection
        .collection('applicants')
        .findOne({ applicantId, password });
  
      if (!applicant) {
        throw new Error("Invalid applicant ID or password");
      }
  
      // Step 2: Check for pending transactions
      const transaction = await this.connection
        .collection('transactions')
        .findOne({ applicantId, status: "Pending", type:"Application Fee" }, { sort: { createdAt: -1 } });
  
      if (transaction) {
        // Return status code 501 with the transaction details
        return {
          statusCode: 501,
          message: "Pending transaction found",
          data: transaction
        };
      }
  
      // Return status code 200 with the applicant details
      return {
        statusCode: 200,
        message: "Applicant found",
        data: applicant,
      };
    } catch (error) {
      console.error("Error during applicant login:", error.message);
      throw new Error("An error occurred during login.");
    }
  }
  
  async applicantStatus(forms: any): Promise<any> {
    const { applicantId, password } = forms;
    
    try {
      // Step 1: Find the applicant
      const applicant = await this.connection
        .collection('applicants')
        .findOne({ applicantId, password });
      console.log(applicant)
      if (!applicant) {
        throw new Error("Invalid applicant ID or password");
      }
  
      // Return status code 200 with the applicant details
      return {
        statusCode: 200,
        message: "Applicant found",
        data: applicant,
      };
    } catch (error) {
      console.error("Error during applicant login:", error.message);
      throw new Error("An error occurred during login.");
    }
  }
  
}
