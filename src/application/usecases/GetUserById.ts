import type { UserRepositoryPort } from '../ports/UserRepositoryPort';
import { mapDomainToView } from '../mapping/UserMapper';
import type { UserViewDTO } from '../dto/UserViewDTO';

export class GetUserById {
  constructor(private readonly repo: UserRepositoryPort) {}

  async execute(id: number): Promise<UserViewDTO | null> {
    const user = await this.repo.findById(id);
    return user ? mapDomainToView(user) : null;
  }
}


