import type { User } from '../../domain/entities/User';

export interface UserQueryRepositoryPort {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
}


