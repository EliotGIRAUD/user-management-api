import type { User } from '../../../domain/entities/User';
import { assignProfileByEmail } from '../../../domain/entities/User';
import type { UserCommandRepositoryPort } from '../../ports/UserCommandRepositoryPort';
import type { CreateUserInputDTO } from '../../dto/CreateUserInputDTO';
import { mapCreateInputToDomain, mapDomainToView } from '../../mapping/UserMapper';
import type { UserViewDTO } from '../../dto/UserViewDTO';
import type { AccountServicePort } from '../../ports/AccountServicePort';

export class CreateUserCommand {
  constructor(private readonly repo: UserCommandRepositoryPort, private readonly accounts: AccountServicePort) {}

  async execute(input: CreateUserInputDTO): Promise<UserViewDTO> {
    const domainInput = mapCreateInputToDomain(input);
    const user: User = { ...domainInput, profile: assignProfileByEmail(domainInput.email), id: 0 } as User;
    // Saga orchestration: create user, then create account; compensate on failure
    const created = await this.repo.create(user);
    try {
      await this.accounts.createAccount(created.id);
    } catch (err) {
      // compensation
      await this.repo.delete(created.id);
      throw err;
    }
    return mapDomainToView(created);
  }
}


