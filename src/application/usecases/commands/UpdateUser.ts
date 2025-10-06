import type { UserCommandRepositoryPort } from '../../ports/UserCommandRepositoryPort';
import { mapDomainToView, mapUpdateInputToDomain } from '../../mapping/UserMapper';
import type { UserViewDTO } from '../../dto/UserViewDTO';
import type { UpdateUserInputDTO } from '../../dto/UpdateUserInputDTO';

export class UpdateUserCommand {
  constructor(private readonly repo: UserCommandRepositoryPort) {}

  async execute(id: number, updated: UpdateUserInputDTO): Promise<UserViewDTO | null> {
    const domainUpdate = mapUpdateInputToDomain(updated);
    const saved = await this.repo.update(id, domainUpdate);
    return saved ? mapDomainToView(saved) : null;
  }
}


