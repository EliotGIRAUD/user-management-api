import { Repository } from 'typeorm';
import type { User } from '../../domain/entities/User';
import { UserOrmEntity } from './entities/UserOrmEntity';
import { mapOrmToDomain } from './mapping/UserOrmMapper';
import type { UserQueryRepositoryPort } from '../../application/ports/UserQueryRepositoryPort';

export class UserQueryRepositoryImpl implements UserQueryRepositoryPort {
  constructor(private readonly repo: Repository<UserOrmEntity>) {}

  async findAll(): Promise<User[]> {
    const found = await this.repo.find();
    return found.map(mapOrmToDomain);
  }

  async findById(id: number): Promise<User | null> {
    const found = await this.repo.findOneBy({ id });
    return found ? mapOrmToDomain(found) : null;
  }
}


