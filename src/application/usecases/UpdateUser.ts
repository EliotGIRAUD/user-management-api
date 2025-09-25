import type { UserRepositoryPort } from '../ports/UserRepositoryPort';
import type { User } from '../../domain/entities/User';

export class UpdateUser {
  constructor(private readonly repo: UserRepositoryPort) {}

  execute(id: number, updated: Partial<User>): Promise<User | null> {
    return this.repo.update(id, updated);
  }
}


