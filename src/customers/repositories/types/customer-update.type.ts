import { GenderEnum } from '../../entities/customer.entity';

export type CustomerUpdateData = Partial<{
  name: string;
  email: string;
  birthDate?: Date | string;
  gender?: GenderEnum;
  nationalityId?: string;
  isActive?: boolean;
}>;
