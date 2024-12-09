import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schemas/student.schema';
import { StudentService } from './services/student.service';
import { StudentController } from './controllers/student.controllers';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule global, accessible in any module
      envFilePath: '.env', // Optional, defaults to .env in the root directory
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    ClientsModule.register([
      {
        name: 'STUDENT_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: Number(`${process.env.STUDENT_PORT_INTERNAL}`) },
        },
      ])
  ],
  providers: [StudentService],
  controllers: [StudentController]
})
export class AppModule {}
