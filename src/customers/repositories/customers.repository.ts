import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { ICustomersRepository } from './customers.repository.interface';
import { CustomerCreateData } from './types';

@Injectable()
export class CustomersRepository implements ICustomersRepository {
  constructor(
    @InjectRepository(Customer)
    private readonly repository: Repository<Customer>
  ) {}

  create(data: CustomerCreateData): Customer {
    return this.repository.create(data);
  }

  async save(customer: Customer): Promise<Customer> {
    return await this.repository.save(customer);
  }

  async findById(id: string): Promise<Customer | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByIdAndHostId(id: string, hostId: string): Promise<Customer | null> {
    return this.repository.findOne({ where: { id, hostId } });
  }

  async findAllByHostId(hostId: string): Promise<Customer[]> {
    return this.repository.find({ where: { hostId }, order: { createdAt: 'DESC' } });
  }

  async remove(customer: Customer): Promise<void> {
    await this.repository.remove(customer);
  }
}
