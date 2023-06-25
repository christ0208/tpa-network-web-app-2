import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const adapter = new FastifyAdapter({ logger: true });
  const CORS_OPTIONS = {
    origin: ['*'], // or '*' or whatever is required
    allowedHeaders: [
      'Access-Control-Allow-Origin',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Content-Type',
      'Authorization',
    ],
    exposedHeaders: 'Authorization',
    credentials: true,
    methods: ['GET', 'PUT', 'OPTIONS', 'POST', 'DELETE'],
  };
  adapter.enableCors(CORS_OPTIONS);

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
