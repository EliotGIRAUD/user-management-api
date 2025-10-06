import type { UserRepositoryPort } from '../ports/UserRepositoryPort';
import { mapDomainToView, mapUpdateInputToDomain } from '../mapping/UserMapper';
import type { UserViewDTO } from '../dto/UserViewDTO';
import type { UpdateUserInputDTO } from '../dto/UpdateUserInputDTO';

export class UpdateUser {
  constructor(private readonly repo: UserRepositoryPort) {}

  async execute(id: number, updated: UpdateUserInputDTO): Promise<UserViewDTO | null> {
    const domainUpdate = mapUpdateInputToDomain(updated);
    const saved = await this.repo.update(id, domainUpdate);
    return saved ? mapDomainToView(saved) : null;
  }
}


