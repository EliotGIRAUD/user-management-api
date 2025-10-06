import type { User } from '../../../domain/entities/User';
import { assignProfileByEmail } from '../../../domain/entities/User';
import type { UserCommandRepositoryPort } from '../../ports/UserCommandRepositoryPort';
import type { CreateUserInputDTO } from '../../dto/CreateUserInputDTO';
import { mapCreateInputToDomain, mapDomainToView } from '../../mapping/UserMapper';
import type { UserViewDTO } from '../../dto/UserViewDTO';

export class CreateUserCommand {
  constructor(private readonly repo: UserCommandRepositoryPort) {}

  async execute(input: CreateUserInputDTO): Promise<UserViewDTO> {
    const domainInput = mapCreateInputToDomain(input);
    const user: User = { ...domainInput, profile: assignProfileByEmail(domainInput.email), id: 0 } as User;
    const created = await this.repo.create(user);
    return mapDomainToView(created);
  }
}


