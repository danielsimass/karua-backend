import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Host } from '../../hosts/entities/host.entity';
import { Exclude } from 'class-transformer';
import { RoleType } from '../enums/role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100, nullable: false })
  username: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255, nullable: true })
  password?: string;

  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.STAFF,
  })
  role: RoleType;

  @Column({ type: 'uuid', name: 'host_id', nullable: false })
  hostId: string;

  @ManyToOne(() => Host, { eager: true })
  @JoinColumn({ name: 'host_id' })
  host: Host;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', name: 'is_first_login', default: true })
  isFirstLogin: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamptz', name: 'invite_sent_at', nullable: true })
  inviteSentAt?: Date;

  @Exclude()
  @Column({ type: 'varchar', length: 255, name: 'secure_code', nullable: true })
  secureCode?: string;
}
