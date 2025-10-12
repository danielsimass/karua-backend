import { RoleType } from '../../users/enums/role.enum';

export interface JwtPayload {
  sub: string; // User ID
  email: string;
  username: string;
  role: RoleType;
  hostId: string;
  iat?: number;
  exp?: number;
}
