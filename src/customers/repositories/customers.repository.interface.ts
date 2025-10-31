import { Customer } from '../entities/customer.entity';
import { CustomerCreateData, CustomerUpdateData } from './types';

export interface ICustomersRepository {
  create(data: CustomerCreateData): Customer;
  save(customer: Customer): Promise<Customer>;
  findById(id: string): Promise<Customer | null>;
  findByIdAndHostId(id: string, hostId: string): Promise<Customer | null>;
  findAllByHostId(hostId: string): Promise<Customer[]>;
  remove(customer: Customer): Promise<void>;
}
