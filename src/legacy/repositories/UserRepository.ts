import { AppDataSource } from '../config/ormconfig';
import { User } from '../models/UserEntity';
import { Repository } from 'typeorm';

export class UserRepository {
  private repo: Repository<User>;

  constructor() {
    this.repo = AppDataSource.getRepository(User);
  }

  create(user: User): Promise<User> {
    return this.repo.save(user);
  }

  findAll(): Promise<User[]> {
    return this.repo.find();
  }

  findById(id: number): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }

  update(id: number, updated: Partial<User>): Promise<User | null> {
    return this.repo.findOneBy({ id }).then(user => {
      if (!user) return null;
      Object.assign(user, updated);
      return this.repo.save(user);
    });
  }

  delete(id: number): Promise<boolean> {
    return this.repo.delete(id).then(result => result.affected !== 0);
  }
}
