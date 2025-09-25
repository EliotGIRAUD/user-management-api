import { Repository } from 'typeorm';
import type { UserRepositoryPort } from '../../application/ports/UserRepositoryPort';
import type { User } from '../../domain/entities/User';
import { UserOrmEntity } from './entities/UserOrmEntity';

export class UserRepositoryImpl implements UserRepositoryPort {
  constructor(private readonly repo: Repository<UserOrmEntity>) {}

  async create(user: User): Promise<User> {
    const entity = this.repo.create(user as any);
    const saved = await this.repo.save(entity);
    return saved as unknown as User;
  }

  findAll(): Promise<User[]> {
    return this.repo.find() as unknown as Promise<User[]>;
  }

  async findById(id: number): Promise<User | null> {
    const found = await this.repo.findOneBy({ id });
    return (found as unknown as User) ?? null;
  }

  async update(id: number, updated: Partial<User>): Promise<User | null> {
    const found = await this.repo.findOneBy({ id });
    if (!found) return null;
    Object.assign(found, updated);
    const saved = await this.repo.save(found);
    return saved as unknown as User;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected !== 0;
  }
}


