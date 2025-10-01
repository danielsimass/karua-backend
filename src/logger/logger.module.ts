import { Module } from '@nestjs/common';

import { LoggerConfigService } from './logger.service';
import { LoggerModule } from 'nestjs-pino';

@Module({
  providers: [LoggerConfigService],
  exports: [LoggerConfigService],
})
export class LoggerConfigModule {}
