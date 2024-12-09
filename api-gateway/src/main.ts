import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
   
  
  const corsOptions: CorsOptions = {
    origin: '*', // Replace '*' with the specific origin(s) if needed
    allowedHeaders: 'Content-Type,Authorization',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Specify allowed HTTP methods
    credentials: true, // Allows credentials (cookies, authentication, etc.) if needed
  };
  app.enableCors(corsOptions);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth() // Add this if you are using JWT or any other auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
