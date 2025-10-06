import type { UserCommandRepositoryPort } from '../../ports/UserCommandRepositoryPort';
import type { AccountServicePort } from '../../ports/AccountServicePort';
import { v4 as uuidv4 } from 'uuid';
import { AppDataSource } from '../../../external/datasource';
import { OutboxOrmEntity } from '../../../persistence/typeorm/entities/OutboxOrmEntity';

export class DeleteUserCommand {
  constructor(private readonly repo: UserCommandRepositoryPort, private readonly accounts: AccountServicePort) {}

  async execute(id: number): Promise<boolean> {
    if (process.env.USE_SYNC_SAGA !== 'false') {
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
    // Async saga via outbox
    const outboxRepo = AppDataSource.getRepository(OutboxOrmEntity);
    const event = new OutboxOrmEntity();
    event.id = uuidv4();
    event.aggregateType = 'User';
    event.aggregateId = id;
    event.eventType = 'UserDeletionRequested';
    event.payload = { messageId: event.id, occurredAt: new Date().toISOString(), userId: id };
    event.status = 'PENDING';
    await outboxRepo.save(event);
    // Ici, on peut soit marquer l'utilisateur comme "pending deletion", soit supprimer après confirmation.
    // Pour simplicité, on supprime immédiatement (compensation possible via événements d'échec côté comptes si nécessaire).
    return this.repo.delete(id);
  }
}


