import type { UserRepositoryPort } from '../ports/UserRepositoryPort';
import { User, assignProfileByEmail } from '../../domain/entities/User';
import type { CreateUserInputDTO } from '../dto/CreateUserInputDTO';
import { mapCreateInputToDomain, mapDomainToView } from '../mapping/UserMapper';
import type { UserViewDTO } from '../dto/UserViewDTO';

export class CreateUser {
  constructor(private readonly repo: UserRepositoryPort) {}

  async execute(input: CreateUserInputDTO): Promise<UserViewDTO> {
    const domainInput = mapCreateInputToDomain(input);
    const user: User = { ...domainInput, profile: assignProfileByEmail(domainInput.email), id: 0 } as User;
    const created = await this.repo.create(user);
    return mapDomainToView(created);
  }
}


