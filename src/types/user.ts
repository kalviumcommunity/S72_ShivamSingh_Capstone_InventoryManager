export type UserRole = 'manager' | 'staff';

export interface UserType {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  avatar?: string;
}