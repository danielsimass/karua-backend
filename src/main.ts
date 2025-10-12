import './telemetry';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Karuá API')
    .setDescription('API para gestão de hotéis e pousadas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.use(
    '/docs',
    apiReference({
      content: document,
      cdn: 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest',
      theme: 'elysiajs',
    })
  );
  app.useLogger(app.get(Logger));
  app.flushLogs();
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/docs`);
}
bootstrap();
