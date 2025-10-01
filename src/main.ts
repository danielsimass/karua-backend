import './telemetry';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  
  app.useLogger(app.get(Logger));
  app.flushLogs();
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
