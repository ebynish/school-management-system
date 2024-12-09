import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Connection } from 'mongoose';
import { Form, FormDocument } from 'src/schemas/form.schema';
import { InjectConnection } from '@nestjs/mongoose';
import { IntegrationsService } from 'src/integrations/services/integration.service';
import { AuditService } from './audit.service';
import { ApprovalRuleService } from './approval-rule.service';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom,  } from 'rxjs';
import { ApprovalWorkflowService } from './approval-workflow.service';


@Injectable()
export class FormService {
  private client: ClientProxy;
  private clientUser: ClientProxy;
  constructor(
    @InjectModel(Form.name) private readonly formModel: Model<FormDocument>,
    private readonly integrationsService: IntegrationsService,
    private readonly auditService: AuditService,
    private readonly approvalService: ApprovalRuleService,
    private readonly approvalWorkflowService: ApprovalWorkflowService,
    @InjectConnection() private connection: Connection
  ) {  // Initialize TCP client to communicate with notification service
    this.clientUser = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'localhost', port: Number(`${process.env.AUTH_PORT_EXTERNAL}`)},
    });
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: 'localhost', port: Number(`${process.env.EMAIL_PORT_EXTERNAL}`) }, // Adjust host and port as necessary
    });

  }

  // Create a new form
  async create(formData: any): Promise<any> {
    const newForm = new this.formModel(formData);
    return await newForm.save();
  }

 async getUser(userId:any){
  return await firstValueFrom(this.clientUser.send({ cmd: 'find-user' }, userId));
 }
  async findAll(page: number, limit: number, searchText: string):Promise<any> {
    try{
        let query = {};

        // Implementing search functionality
        if (searchText) {
          query = {
            $or: [
              { firstName: new RegExp(searchText, 'i') },
              { lastName: new RegExp(searchText, 'i') },
              { email: new RegExp(searchText, 'i') },
            ],
          };
        }

        const totalItems = await this.formModel.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);
        const items = await this.formModel
          .find(query)
          .skip((page - 1) * limit)
          .limit(limit)
          .exec();

        return {
          statusCode: 200,
          totalPages,
          rows: items,
          totalItems,
          currentPage: page
        };
    }catch(e){
      throw new Error(e.message)
    }
  }

  async findTable(type: string, page: number, limit: number, searchText: any, id:any, mode: string, populate:string): Promise<any> {
    try {
      
      let query = id ? {[mode?.split("?q")[0]]: id} :{};
      
      
      // Implementing search functionality
      query = (searchText !== "null" && searchText !== "") ?      
        {
          $or: [
            { firstName: new RegExp(searchText, 'i') },
            { lastName: new RegExp(searchText, 'i') },
            { email: new RegExp(searchText, 'i') },
            { status: new RegExp(searchText, 'i') },
            { amount: new RegExp(searchText, 'i') },
            { [`${this.pluralToSingular(type)}`]: new RegExp(searchText, 'i') },
          ],
        } :  query
      
  
      const dynamicCollection = this.connection.collection(type);
            // Get the total number of documents
      const totalItems = await dynamicCollection.countDocuments(query);
      
      // Get the count of documents by status using aggregation
      const countByStatus = await dynamicCollection.aggregate([
        { $match: query },
        {
          $group: {
            _id: "$status", // Group by the 'status' field
            count: { $sum: 1 }, // Count the number of documents in each group
          },
        },
      ]).toArray();
  
      // Convert the aggregation result to a simple object with status as keys
      const statusCounts = countByStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});
  
      // Get total pages based on the items count and limit
      const totalPages = Math.ceil(totalItems / limit);
      let itemsCursor:any;
      // Fetch the actual data based on the query and pagination
      if (populate) {
        const populateFields = populate.split(',');
      
        // Use aggregation to join collections
        itemsCursor = await dynamicCollection
          .aggregate([
            { $match: query },
            ...populateFields.map((field) => ({
              $addFields: {
                [`${field}Id`]: { $toObjectId: `$${field}Id` },  // Convert field to ObjectId
              },
            })),
            ...populateFields.map((field) => ({
              $lookup: {
                from: this.pluralize(field), // The collection to join
                localField: `${field}Id`, // Local field to match
                foreignField: '_id', // Foreign field to match
                as: field, // Name of the output array
              },
            })),
            ...populateFields.map((field) => ({
              $unwind: {
                path: `$${field}`,
                preserveNullAndEmptyArrays: true, // Keep empty fields if no match
              },
            })),
            { $skip: (page - 1) * limit },
            { $limit: limit },
          ])
          .toArray(); // Convert to array if needed
      } else {
        itemsCursor = await dynamicCollection
          .find(query)
          .skip((page - 1) * limit)
          .limit(limit)
          .toArray();
      }
      const items = await itemsCursor; // Convert cursor to array
  
      return {
        statusCode: 200,
        totalPages,
        rows: items,
        totalItems,
        currentPage: page,
        statusCounts, // Add status count to the response
      };
    } catch (e) {
      // Log the error message instead of the whole error object
      console.error('Error in findTable:', e.message);
      throw new Error(e.message);
    }
  }
  
  async findTableByStatus(
    type: string,
    page: number,
    limit: number,
    searchText: string,
    status: string,
    id:any, mode: string,
    populate: string
  ): Promise<any> {
    try {
      // Define the base query with status
      let query = id ? {[mode]: id, status} :{status};
    
  
      // Implementing search functionality if searchText is provided
      if (searchText) {
        query = {
          ...query, // Spread the previous query to keep the status filter
          $or: [
            { firstName: new RegExp(searchText, 'i') },
            { lastName: new RegExp(searchText, 'i') },
            { email: new RegExp(searchText, 'i') },
          ],
        };
      }
  
      const dynamicCollection = this.connection.collection(type);
  
      // Get the total number of documents matching the query
      const totalItems = await dynamicCollection.countDocuments(query);
  
      // Calculate total pages based on the number of items and the limit
      const totalPages = Math.ceil(totalItems / limit);
  
      // Fetch the paginated data
      let itemsCursor:any;
      if (populate) {
        const populateFields = populate.split(',');
      
        // Use aggregation to join collections
        itemsCursor = await dynamicCollection
          .aggregate([
            { $match: query },
            ...populateFields.map((field) => ({
              $lookup: {
                from: this.pluralize(field), // The collection to join
                localField: `${field}Id`, // Local field to match
                foreignField: '_id', // Foreign field to match
                as: field, // Name of the output array
              },
            })),
            { $skip: (page - 1) * limit },
            { $limit: limit },
          ])
          .toArray(); // Convert to array if needed
      } else {
        itemsCursor = await dynamicCollection
          .find(query)
          .skip((page - 1) * limit)
          .limit(limit)
          .toArray();
      }
      
      
      const items = await itemsCursor; // Convert the cursor to an array
  
      return {
        statusCode: 200,
        totalPages,
        rows: items,
        totalItems,
        currentPage: page,
      };
    } catch (e) {
      // Log the error message
      console.error('Error in findTableByStatus:', e.message);
      throw new Error(e.message);
    }
  }
  
  async getSummary(data:any):Promise<any>{
      // Dynamically access the collection based on the `schema` property
      const dynamicCollection = this.connection.collection(data.type);
      let result = await dynamicCollection.findOne({ _id: new mongoose.Types.ObjectId(data?.id)})
      
      return result
  }


  async findOne(id: any): Promise<any> {
    const form = await this.formModel.findById({ _id: id}).exec();
    if (!form) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }
    return form;
  }

  
  async findBySlug(id: any): Promise<any> {
    const form = await this.formModel.findOne({ slug: id}).exec();
    
    
    if (!form) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }
    return form;
  }
  async findById(id: any): Promise<any> {
    
    const form = await this.formModel.findOne({_id: id}).exec();
    
    if (!form) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }
    return form;
  }

  async findData (schema:any, id:any, type:any, status: string):Promise<any>{
    let query: any = id ? { [type]: type === "_id" ? new mongoose.Types.ObjectId(id) : id } : {};

    if (status) {
      query.status = status;
    }
    
    const dynamicCollection = await this.connection.collection(schema).find(query).toArray();
    
    return dynamicCollection
  }

  // Update a form by ID
  async update(id: string, formData: Partial<Form>): Promise<any> {
    const updatedForm = await this.formModel.findByIdAndUpdate(id, formData, { new: true }).exec();
    if (!updatedForm) {
      throw new NotFoundException(`Form with ID ${id} not found`);
    }
    return updatedForm;
  }

  // Delete a form by ID
  async remove(id: string): Promise<any> {
    // const deletedForm = await this.formModel.findOneAndRemove(id).exec();
    // if (!deletedForm) {
    //   throw new NotFoundException(`Form with ID ${id} not found`);
    // }
    // return deletedForm;
    return null
  }

  async submitForm(formData: any, userId: any): Promise<any> {
    try {
      
      const sch = await this.formModel.findOne({ _id: formData?.formId });
  
      // Determine dynamic collections and field names
      const dynamicCollection = this.connection.collection(sch?.schema || formData.schema);
      let pl2sing = this.pluralToSingular(sch?.schema || formData?.schema)
      let pl2sing2  = this.pluralToSingular(sch?.dependency || formData?.dependency);
      
      let rule: any;
      if (sch?.approve) {
        rule = await this.approvalService.getRuleByFormId(formData?.formId);
      }
      
      // Non-integration logic
      if (!sch?.integration && !formData?.integration) {
        // Generate next sequential number if applicable
        if (!formData?._id) {
          console.log(pl2sing, pl2sing2)
          let prefix = formData[pl2sing?.replace("Number", "Id")] || null;
          console.log(prefix,"dhdh")
          const nextNumber = await this.getNextNumber(sch?.schema || formData?.schema, prefix, null);
          console.log(nextNumber)
          formData[`${pl2sing}`] = nextNumber;
        }
        console.log("ss")
        
        // Validate required fields
        const requiredFields = await this.getRequiredFields(sch);
        for (const { name, label } of requiredFields) {
          if (!this.checkFieldExists(formData, name)) {
            throw new Error(`Missing required field: ${label}`);
          }
        }

        console.log('4')
        // Prepare default data
        const defaultData = {
          userId,
          status: 'Pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        formData = { ...defaultData, ...formData };
  
        if (!formData?._id) {
          // Insert new document
          delete formData._id;
          console.log('5')
          const result = await dynamicCollection.insertOne(formData);
  
          // Start approval workflow if required
          if (sch?.approve) {
            await this.approvalWorkflowService.startWorkflow(result?.insertedId, rule._id);
          }
  
          return {
            statusCode: 200,
            message: `${this.pluralToSingular(pl2sing)?.replace('Number', '')} created successfully`,
            data: { id: result?.insertedId },
          };
        } else {
          // Update existing document
          const idN = new mongoose.Types.ObjectId(`${formData._id}`);
          delete formData._id;
          const result = await dynamicCollection.updateMany(
            { _id: idN },
            { $set: formData }
          );
  
          if (sch?.approve) {
            await this.approvalWorkflowService.startWorkflow(idN, rule?._id);
          }

  
          return {
            statusCode: 200,
            message: `${pl2sing?.replace('Number', '')} updated successfully`,
          };
        }
      } else {
        // Integration-based processing (unchanged)
        if (!formData?._id) {
          console.log('no inte')
        const dependencyCollection = this.connection.collection(pl2sing2);
        if(!pl2sing?.includes("transaction"))
          formData["orderId"] = formData[pl2sing2?.replace("Number", "Id")] = await this.getNextNumber(formData?.schema, formData[pl2sing2.replace("Number", "Id")], "Id");
  
        const data = await dependencyCollection.findOne({
          [`${pl2sing2?.replace("Number", "Id")}`]: 
            formData[pl2sing2?.replace("Number", "Id")] || formData[`${this.pluralToSingular(pl2sing2)}`],
        }) || formData;
        
        let result;
        const results = await this.integrationsService.callIntegration(sch?.integration || formData?.integration, data);
        if(formData.dependency)
           result = await dynamicCollection.insertOne(results.formData);
  
        if (sch?.approve) {
          await this.approvalWorkflowService.startWorkflow(result?.insertedId, rule?._id);
        }
        
        return {
          statusCode: 200,
          message: `${pl2sing?.replace('Number', '')} created successfully`,
          data: { id: result?.insertedId, transactionId: results.transactionId },
        };
      }else{
        // Update existing document
        
        const idN = new mongoose.Types.ObjectId(`${formData._id}`);
        delete formData._id;
        const result = await dynamicCollection.updateMany(
          { _id: idN },
          { $set: formData }
        );

        if (sch?.approve) {
          await this.approvalWorkflowService.startWorkflow(idN, rule?._id);
        }
        
        return {
          statusCode: 200,
          message: `${pl2sing?.replace('Number', '')} updated successfully`,
          data: { id: result }
        };
        
      }
      
      }
    } catch (error) {
      console.error('Error in submitForm:', error.message);
      throw new Error('Failed to submit form data');
    }
  }
  
  
  
  // Method to retrieve required fields from the form schema
  async getRequiredFields(form: any): Promise<{ name: string, label: string }[]> {
    const requiredFields: { name: string, label: string }[] = [];

    // Traverse each section and field to find required fields
    form?.sections?.forEach((section, sectionIndex) => {
        this.findRequiredFieldsInSection(section, requiredFields, `sections[${sectionIndex}]`);
    });

    return requiredFields;
}

// Recursive method to find required fields within a section
private findRequiredFieldsInSection(section: any, requiredFields: { name: string, label: string }[], sectionPath: string) {
    // Traverse each field in the section
    section.fields.forEach((field, fieldIndex) => {
        this.findRequiredFieldsInField(field, requiredFields, `${sectionPath}.fields[${fieldIndex}]`);
    });
}

// Recursive method to find required fields in a field
private findRequiredFieldsInField(field: any, requiredFields: { name: string, label: string }[], fieldPath: string) {
    // If the field is marked as required, add its path and label to the list
    if (field.isRequired) {
        requiredFields.push({ name: field.name, label: field.label });
    }

    // If the field contains nested fields, recursively check them
    if (field.fields && field.fields.length > 0) {
        field.fields.forEach((nestedField, nestedIndex) => {
            this.findRequiredFieldsInField(nestedField, requiredFields, `${fieldPath}.fields[${nestedIndex}]`);
        });
    }
}

// Method to check if a field exists in the form data
private checkFieldExists(data: any, fieldPath: string): boolean {
  // Convert array notation to dot notation
  const fields = fieldPath?.replace(/\[(\d+)\]/g, '.$1').split('.');
  
  const checkCurrent = (current: any, remainingFields: string[]): boolean => {
      const field = remainingFields[0];

      // If there are no more fields to check, ensure current is valid
      if (remainingFields.length === 1) {
          return current !== undefined && current !== null;
      }

      if (Array.isArray(current)) {
          // If current is an array, check each item
          for (const item of current) {
              // Recursively check each item in the array
              if (checkCurrent(item, remainingFields)) {
                  return true; // Field exists in at least one object
              }
          }
          return false; // Field not found in any objects
      } else if (typeof current === 'object' && current !== null) {
          // If current is an object, check if it has the field
          if (current.hasOwnProperty(field)) {
              return checkCurrent(current[field], remainingFields.slice(1)); // Move deeper into the object
          } else {
              // Iterate over all keys to check if any sub-key has the remaining fields
              for (const key of Object.keys(current)) {
                  if (checkCurrent(current[key], remainingFields)) {
                      return true; // Field found in one of the sub-keys
                  }
              }
          }
          return false; // Field does not exist
      }

      return false; // Current is neither an object nor an array
  };

  return checkCurrent(data, fields);
}

// private async getNextNumber(db: any, fields: string, type: string): Promise<string> {
//   let field = `${this.pluralToSingular(db, type)}`; 
//   const lastEntry = await this.connection.collection(db).find().sort({ [field]: -1 }).limit(1).toArray();
  
//   const lastNumber = lastEntry.length > 0 ? lastEntry[0][field] : 0; // Default to 0 if no entries exist
//   // Step 2: Increment the last number
  
//   const nextNumber = Number(lastNumber) + 1;

//   // Step 3: Zero-pad the result (assuming you want a total length of 8)
//   const zeroPaddedNumber = nextNumber.toString().padStart(8, '0');

//   return zeroPaddedNumber;
// }
private async getNextNumber(db: string, fields: string | null, type: string | null): Promise<string> {
  // Determine the field name dynamically
  let field = this.pluralToSingular(db, type ? "Id" : "Number");

  // Parse `fields` into a prefix if provided, otherwise use an empty string
  let prefix = fields ? fields?.split('/').join('/') : "";

  // Construct the query condition based on `fields` (if present)
  const queryCondition = fields ? { [field]: { $regex: `^${prefix}` } } : {};

  // Query the database for the last matching entry
  const lastEntry = await this.connection.collection(db).find(queryCondition)
    .sort({ [field]: -1 }) // Sort by the field in descending order
    .limit(1)
    .toArray();

  // Extract the last number from the matching entry or default to 0
  const lastNumber = lastEntry.length > 0 
    ? parseInt(lastEntry[0][field]?.replace(`${prefix}/`, '')) || 0 
    : 0;

  // Increment the last number
  const nextNumber = lastNumber + 1;

  // Zero-pad the result (e.g., assuming a total length of 7 digits)
  const zeroPaddedNumber = nextNumber.toString().padStart(7, '0');

  // Combine prefix with the newly generated number
  const newNumber = prefix ? `${prefix}/${zeroPaddedNumber}` : zeroPaddedNumber;

  return newNumber;
}

private pluralToSingular(schema: string, attach?: string): string {
  
  if (schema?.endsWith("ies")) {
    return schema?.slice(0, -3) + "y" + (attach ? attach : "Number");
  } else if (schema?.endsWith("mes") && !schema?.endsWith("mmes")) {
    return schema?.slice(0, -2) + (attach ? attach : "Number");
  } else if (schema?.endsWith("es") && !schema?.endsWith("mes")) {
    return schema?.slice(0, -2) + (attach ? attach : "Number");
  } else if (schema?.endsWith("s")) {
    return schema?.slice(0, -1) + (attach ? attach : "Number");
  }
  return `${schema}${attach ? attach : "Number"}`;
};


async updateSchema(data: any): Promise<any> {
  try {
    
    const collection = this.connection.collection(data.schema);
    if (!collection) {
      throw new Error(`Collection '${data.schema}' not found.`);
    }

    let filter = {"_id": new mongoose.Types.ObjectId(String(data.id))};
    let update = {"$set": data?.payload};
    delete data?.payload?._id;
    
    
    let result = await collection.updateMany(filter, update);
    
    return { statusCode: 200, message: "Update successful", data: data.payload };
  } catch (error) {
    return {
      statusCode: 500,
      success: false,
      message: error.message || "An error occurred while updating the schema.",
    };
  }
}

private pluralize = (word) => {
  if (!word) return "";

  const lowerWord = word.toLowerCase();

  if (lowerWord.endsWith("y") && !/[aeiou]y$/.test(lowerWord)) {
    return word + "s"; // e.g., "boy" -> "boys"
  } else if (lowerWord.endsWith("y")) {
    return word.slice(0, -1) + "ies"; // e.g., "city" -> "cities"
  } else if (
    lowerWord.endsWith("s") || 
    lowerWord.endsWith("x") || 
    lowerWord.endsWith("z") || 
    lowerWord.endsWith("ch") || 
    lowerWord.endsWith("sh")
  ) {
    return word + "es"; // e.g., "bus" -> "buses"
  } else if (lowerWord.endsWith("f")) {
    return word.slice(0, -1) + "ves"; // e.g., "leaf" -> "leaves"
  } else if (lowerWord.endsWith("fe")) {
    return word.slice(0, -2) + "ves"; // e.g., "knife" -> "knives"
  } else {
    return word + "s"; // Default case: just add "s"
  }
};


}