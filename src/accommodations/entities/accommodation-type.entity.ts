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
import { Host } from '../../hosts/entities/host.entity';
import { Accommodation } from './accommodation.entity';
import { AccommodationPricingSchedule } from './accommodation-pricing-schedule.entity';

@Entity('accommodation_types')
export class AccommodationType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'integer' })
  capacity: number;

  @Column({ type: 'integer' })
  rooms: number;

  @Column({ type: 'integer' })
  bathrooms: number;

  @Column({ type: 'integer', default: 1 })
  minOccupants: number;

  @Column({ type: 'integer' })
  maxOccupants: number;

  @Index('idx_accommodation_types_host_id')
  @Column({ type: 'uuid' })
  hostId: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => Host)
  @JoinColumn({ name: 'host_id' })
  host: Host;

  @OneToMany(() => Accommodation, (accommodation) => accommodation.accommodationType)
  accommodations: Accommodation[];

  @OneToMany(
    () => AccommodationPricingSchedule,
    (pricingSchedule) => pricingSchedule.accommodationType
  )
  pricingSchedules: AccommodationPricingSchedule[];
}
