import type { Profile } from '../types';

export class User {
  id!: number;
  firstName!: string;
  lastName!: string;
  email!: string;
  phone!: string;
  profile!: Profile;
}

export function assignProfileByEmail(email: string): Profile {
  const normalized = email.toLowerCase();
  return normalized.endsWith('@company.com') ? 'ADMIN' : 'STANDARD';
}


