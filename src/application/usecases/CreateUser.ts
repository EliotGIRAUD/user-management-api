import type { UserRepositoryPort } from '../ports/UserRepositoryPort';
import { User, assignProfileByEmail } from '../../domain/entities/User';

export class CreateUser {
  constructor(private readonly repo: UserRepositoryPort) {}

  async execute(input: Omit<User, 'id' | 'profile'>): Promise<User> {
    const user: User = { ...input, profile: assignProfileByEmail(input.email), id: 0 } as User;
    return this.repo.create(user);
  }
}


