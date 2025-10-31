import { Injectable, NotFoundException } from '@nestjs/common';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
import { CustomersRepository } from './repositories';

@Injectable()
export class CustomersService {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async create(hostId: string, data: CreateCustomerDto): Promise<Customer> {
    const entity = this.customersRepository.create({ ...data, hostId });
    return await this.customersRepository.save(entity);
  }

  async findAll(hostId: string): Promise<Customer[]> {
    return await this.customersRepository.findAllByHostId(hostId);
  }

  async findOne(hostId: string, id: string): Promise<Customer> {
    const customer = await this.customersRepository.findByIdAndHostId(id, hostId);
    if (!customer) {
      throw new NotFoundException('Customer não encontrado');
    }
    return customer;
  }

  async update(hostId: string, id: string, data: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findOne(hostId, id);
    Object.assign(customer, data);
    return await this.customersRepository.save(customer);
  }

  async remove(hostId: string, id: string): Promise<void> {
    const customer = await this.findOne(hostId, id);
    await this.customersRepository.remove(customer);
  }
}
