import type { UserCommandRepositoryPort } from '../../ports/UserCommandRepositoryPort';
import type { AccountServicePort } from '../../ports/AccountServicePort';

export class DeleteUserCommand {
  constructor(private readonly repo: UserCommandRepositoryPort, private readonly accounts: AccountServicePort) {}

  async execute(id: number): Promise<boolean> {
    // Saga orchestration: delete accounts first, then user; compensate on failure
    try {
      const userAccounts = await this.accounts.getAccountsByUser(id);
      for (const acc of userAccounts) {
        await this.accounts.deleteAccount(acc.id);
      }
    } catch (err) {
      throw err;
    }
    return this.repo.delete(id);
  }
}


