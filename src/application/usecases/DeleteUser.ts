import type { UserRepositoryPort } from '../ports/UserRepositoryPort';

export class DeleteUser {
  constructor(private readonly repo: UserRepositoryPort) {}

  execute(id: number): Promise<boolean> {
    return this.repo.delete(id);
  }
}


