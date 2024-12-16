import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { Student, StudentSchema } from './schemas/student.schema';
import { Result, ResultSchema } from './schemas/result.schema';
import { StudentService } from './services/student.service';
import { StudentController } from './controllers/student.controllers';

@Module({
  imports: [
    // Configuration Module
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule global
      envFilePath: '.env', // Defaults to .env in the root directory
    }),
    // Mongoose Connection
    MongooseModule.forRoot(process.env.MONGO_URI),
    // Mongoose Feature Modules
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Result.name, schema: ResultSchema },
    ]),
    // Microservice Client Module
    ClientsModule.register([
      {
        name: 'STUDENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: Number(process.env.STUDENT_PORT_INTERNAL),
        },
      },
    ]),
  ],
  controllers: [StudentController], // Controller for handling requests
  providers: [StudentService], // Service for business logic
})
export class AppModule {}
