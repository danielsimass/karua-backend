import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { LoggerConfigModule } from './logger/logger.module';
import { LoggerConfigService } from './logger/logger.service';
import { LoggerModule } from 'nestjs-pino';
import { CustomersModule } from './customers/customers.module';
import { HostsModule } from './hosts/hosts.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule.forRootAsync({
      imports: [LoggerConfigModule],
      inject: [LoggerConfigService],
      useFactory: (loggerConfig: LoggerConfigService) => {
        return loggerConfig.getPinoHttpOptions();
      },
    }),
    LoggerConfigModule,
    CustomersModule,
    HostsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
