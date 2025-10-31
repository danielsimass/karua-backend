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
import { AccommodationType } from './accommodation-type.entity';

@Entity('accommodation_pricing_schedules')
export class AccommodationPricingSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  accommodationTypeId: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'decimal', precision: 18, scale: 6 })
  price: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => AccommodationType, (accommodationType) => accommodationType.pricingSchedules)
  @JoinColumn({ name: 'accommodation_type_id' })
  accommodationType: AccommodationType;
}
