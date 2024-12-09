import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: { host: 'localhost', port: Number(`${process.env.EMAIL_PORT_INTERNAL}`)}
  });
  app.listen();
}
bootstrap();
