import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { LoggerConfigModule } from './logger/logger.module';
import { LoggerConfigService } from './logger/logger.service';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [DatabaseModule, LoggerModule.forRootAsync({
    imports: [LoggerConfigModule],
    inject: [LoggerConfigService],
    useFactory: (loggerConfig: LoggerConfigService) => {
      return loggerConfig.getPinoHttpOptions();
    },
  }),LoggerConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
