import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { Customer } from './entities/customer.entity';
import { Nationality } from './entities/nationality.entity';
import { CustomersRepository } from './repositories';
import { CustomersNationalitiesController } from './customers-nationalities.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Nationality])],
  controllers: [CustomersController, CustomersNationalitiesController],
  providers: [CustomersService, CustomersRepository],
})
export class CustomersModule {}
