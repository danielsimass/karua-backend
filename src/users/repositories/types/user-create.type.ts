import { RoleType } from 'src/users/enums/role.enum';

export interface UserCreateData {
  name: string;
  email: string;
  username: string;
  password?: string;
  role: RoleType;
  hostId: string;
  isActive?: boolean;
}
