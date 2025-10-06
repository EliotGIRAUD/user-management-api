import type { UserCommandRepositoryPort } from '../../ports/UserCommandRepositoryPort';

export class DeleteUserCommand {
  constructor(private readonly repo: UserCommandRepositoryPort) {}

  execute(id: number): Promise<boolean> {
    return this.repo.delete(id);
  }
}


