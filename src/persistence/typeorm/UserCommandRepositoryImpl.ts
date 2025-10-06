import { Repository } from 'typeorm';
import type { User } from '../../domain/entities/User';
import { UserOrmEntity } from './entities/UserOrmEntity';
import { mapDomainToOrm, mapOrmToDomain } from './mapping/UserOrmMapper';
import type { UserCommandRepositoryPort } from '../../application/ports/UserCommandRepositoryPort';

export class UserCommandRepositoryImpl implements UserCommandRepositoryPort {
  constructor(private readonly repo: Repository<UserOrmEntity>) {}

  async create(user: User): Promise<User> {
    const entity = this.repo.create(mapDomainToOrm(user));
    const saved = await this.repo.save(entity);
    return mapOrmToDomain(saved);
  }

  async update(id: number, updated: Partial<User>): Promise<User | null> {
    const found = await this.repo.findOneBy({ id });
    if (!found) return null;
    Object.assign(found, mapDomainToOrm({ ...mapOrmToDomain(found), ...updated } as User));
    const saved = await this.repo.save(found);
    return mapOrmToDomain(saved);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected !== 0;
  }
}


