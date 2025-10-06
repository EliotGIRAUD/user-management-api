import type { UserQueryRepositoryPort } from '../../ports/UserQueryRepositoryPort';
import { mapDomainToView } from '../../mapping/UserMapper';
import type { UserViewDTO } from '../../dto/UserViewDTO';

export class GetAllUsersQuery {
  constructor(private readonly repo: UserQueryRepositoryPort) {}

  async execute(): Promise<UserViewDTO[]> {
    const users = await this.repo.findAll();
    return users.map(mapDomainToView);
  }
}


