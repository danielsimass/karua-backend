import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Host } from '../../hosts/entities/host.entity';
import { AccommodationType } from './accommodation-type.entity';

@Entity('accommodations')
export class Accommodation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  accommodationTypeId: string;

  @Column({ type: 'varchar', length: 50 })
  identifier: string;

  @Column({ type: 'integer', nullable: true })
  floor: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Index('idx_accommodations_host_id')
  @Column({ type: 'uuid' })
  hostId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => AccommodationType)
  @JoinColumn({ name: 'accommodation_type_id' })
  accommodationType: AccommodationType;

  @ManyToOne(() => Host)
  @JoinColumn({ name: 'host_id' })
  host: Host;
}
