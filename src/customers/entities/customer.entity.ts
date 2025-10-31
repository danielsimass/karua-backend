import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { CustomerDocument } from './customer-document.entity';
import { CustomerContact } from './customer-contact.entity';
import { Nationality } from './nationality.entity';
import { Host } from '../../hosts/entities/host.entity';

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  NOT_INFORMED = 'not_informed',
}

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ type: 'enum', enum: GenderEnum, nullable: true })
  gender: GenderEnum;

  @Column({ type: 'uuid', nullable: true })
  nationalityId: string;

  @Index('idx_customers_host_id')
  @Column({ type: 'uuid' })
  hostId: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => Nationality, { nullable: true })
  @JoinColumn({ name: 'nationality_id' })
  nationality: Nationality;

  @ManyToOne(() => Host)
  @JoinColumn({ name: 'host_id' })
  host: Host;

  @OneToMany(() => CustomerDocument, (customerDocument) => customerDocument.customer, {
    cascade: true,
  })
  documents: CustomerDocument[];

  @OneToMany(() => CustomerContact, (customerContact) => customerContact.customer, {
    cascade: true,
  })
  contacts: CustomerContact[];
}
