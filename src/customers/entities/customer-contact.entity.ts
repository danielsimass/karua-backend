import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

export enum ContactTypeEnum {
  PHONE = 'phone',
  MOBILE = 'mobile',
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
  OTHER = 'other',
}

@Entity('customer_contacts')
export class CustomerContact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  customerId: string;

  @Column({ type: 'varchar', length: 100 })
  value: string;

  @Column({ type: 'enum', enum: ContactTypeEnum })
  type: ContactTypeEnum;

  @Column({ type: 'boolean', default: false })
  isPrimary: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => Customer, (customer) => customer.contacts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;
}
