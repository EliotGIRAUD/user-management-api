import type { User } from '../../domain/entities/User';

export interface UserRepositoryPort {
  create(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  update(id: number, updated: Partial<User>): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}


