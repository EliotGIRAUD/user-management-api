import type { User } from '../../domain/entities/User';

export interface UserCommandRepositoryPort {
  create(user: User): Promise<User>;
  update(id: number, updated: Partial<User>): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}


