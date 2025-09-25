import type { UserRepositoryPort } from '../ports/UserRepositoryPort';
import type { User } from '../../domain/entities/User';

export class GetUserById {
  constructor(private readonly repo: UserRepositoryPort) {}

  execute(id: number): Promise<User | null> {
    return this.repo.findById(id);
  }
}


