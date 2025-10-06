import type { Profile } from '../../domain/types';

export interface UserViewDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profile: Profile;
}


