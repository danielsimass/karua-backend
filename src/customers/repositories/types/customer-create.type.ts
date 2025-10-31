import { GenderEnum } from '../../entities/customer.entity';

export type CustomerCreateData = {
  name: string;
  email: string;
  birthDate?: Date | string;
  gender?: GenderEnum;
  nationalityId?: string;
  hostId: string;
  isActive?: boolean;
};
