import type { UserRepositoryPort } from '../ports/UserRepositoryPort';
import type { User } from '../../domain/entities/User';

export class GetAllUsers {
  constructor(private readonly repo: UserRepositoryPort) {}

  execute(): Promise<User[]> {
    return this.repo.findAll();
  }
}


