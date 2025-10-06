import type { UserQueryRepositoryPort } from '../../ports/UserQueryRepositoryPort';
import { mapDomainToView } from '../../mapping/UserMapper';
import type { UserViewDTO } from '../../dto/UserViewDTO';

export class GetUserByIdQuery {
  constructor(private readonly repo: UserQueryRepositoryPort) {}

  async execute(id: number): Promise<UserViewDTO | null> {
    const user = await this.repo.findById(id);
    return user ? mapDomainToView(user) : null;
  }
}


