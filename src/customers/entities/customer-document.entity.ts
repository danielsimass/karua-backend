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

export enum DocumentTypeEnum {
  CPF = 'cpf',
  RG = 'rg',
  CNH = 'cnh',
  PASSPORT = 'passport',
  DNI = 'dni',
  CEDULA = 'cedula',
  RUC = 'ruc',
  CI = 'ci',
  MERCOSUL_ID = 'mercosul_id',
  OTHER = 'other',
}

@Entity('customer_documents')
export class CustomerDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  customerId: string;

  @Column({ type: 'varchar', length: 50 })
  document: string;

  @Column({ type: 'enum', enum: DocumentTypeEnum })
  type: DocumentTypeEnum;

  @Column({ type: 'varchar', length: 3, nullable: true })
  issuingCountry: string;

  @Column({ type: 'boolean', default: false })
  isPrimary: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => Customer, (customer) => customer.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;
}
