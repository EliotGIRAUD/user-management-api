import type { UserRepositoryPort } from '../ports/UserRepositoryPort';
import { mapDomainToView } from '../mapping/UserMapper';
import type { UserViewDTO } from '../dto/UserViewDTO';

export class GetAllUsers {
  constructor(private readonly repo: UserRepositoryPort) {}

  async execute(): Promise<UserViewDTO[]> {
    const users = await this.repo.findAll();
    return users.map(mapDomainToView);
  }
}


