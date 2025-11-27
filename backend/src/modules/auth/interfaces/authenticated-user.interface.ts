import { UserRole } from '@/modules/users/users.entity';

export interface AuthenticatedUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}
