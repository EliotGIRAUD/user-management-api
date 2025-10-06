import type { User } from '../../../domain/entities/User';
import { assignProfileByEmail } from '../../../domain/entities/User';
import type { UserCommandRepositoryPort } from '../../ports/UserCommandRepositoryPort';
import type { CreateUserInputDTO } from '../../dto/CreateUserInputDTO';
import { mapCreateInputToDomain, mapDomainToView } from '../../mapping/UserMapper';
import type { UserViewDTO } from '../../dto/UserViewDTO';
import type { AccountServicePort } from '../../ports/AccountServicePort';
import { v4 as uuidv4 } from 'uuid';
import { AppDataSource } from '../../../external/datasource';
import { OutboxOrmEntity } from '../../../persistence/typeorm/entities/OutboxOrmEntity';

export class CreateUserCommand {
  constructor(private readonly repo: UserCommandRepositoryPort, private readonly accounts: AccountServicePort) {}

  async execute(input: CreateUserInputDTO): Promise<UserViewDTO> {
    const domainInput = mapCreateInputToDomain(input);
    const user: User = { ...domainInput, profile: assignProfileByEmail(domainInput.email), id: 0 } as User;
    const created = await this.repo.create(user);

    if (process.env.USE_SYNC_SAGA !== 'false') {
      try {
        await this.accounts.createAccount(created.id);
      } catch (err) {
        await this.repo.delete(created.id);
        throw err;
      }
    } else {
      // Outbox event instead of sync call
      const outboxRepo = AppDataSource.getRepository(OutboxOrmEntity);
      const event = new OutboxOrmEntity();
      event.id = uuidv4();
      event.aggregateType = 'User';
      event.aggregateId = created.id;
      event.eventType = 'UserCreated';
      event.payload = { messageId: event.id, occurredAt: new Date().toISOString(), user: { id: created.id, firstName: created.firstName, lastName: created.lastName, email: created.email } };
      event.status = 'PENDING';
      await outboxRepo.save(event);
    }
    return mapDomainToView(created);
  }
}


