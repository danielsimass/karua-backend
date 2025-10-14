import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { LegalRepresentative } from './legal-representative.entity';

@Entity('hosts')
export class Host {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 18, nullable: true })
  cnpj: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  cep: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  street: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  number: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => LegalRepresentative, (legalRepresentative) => legalRepresentative.host, {
    cascade: true,
  })
  legalRepresentatives: LegalRepresentative[];
}
