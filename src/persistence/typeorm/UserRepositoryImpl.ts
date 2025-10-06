import { Repository } from 'typeorm';
import type { UserRepositoryPort } from '../../application/ports/UserRepositoryPort';
import type { User } from '../../domain/entities/User';
import { UserOrmEntity } from './entities/UserOrmEntity';
import { mapDomainToOrm, mapOrmToDomain } from './mapping/UserOrmMapper';

export class UserRepositoryImpl implements UserRepositoryPort {
  constructor(private readonly repo: Repository<UserOrmEntity>) {}

  async create(user: User): Promise<User> {
    const entity = this.repo.create(mapDomainToOrm(user));
    const saved = await this.repo.save(entity);
    return mapOrmToDomain(saved);
  }

  async findAll(): Promise<User[]> {
    const found = await this.repo.find();
    return found.map(mapOrmToDomain);
  }

  async findById(id: number): Promise<User | null> {
    const found = await this.repo.findOneBy({ id });
    return found ? mapOrmToDomain(found) : null;
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


