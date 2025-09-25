import { User } from '../models/UserEntity.js';
import { UserRepository } from '../repositories/UserRepository.js';

export class UserService {
  private readonly repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async createUser(userData: User): Promise<User> {
    const email = userData.email?.toLowerCase() ?? '';
    const isCompany = email.endsWith('@company.com');
    userData.profile = isCompany ? 'ADMIN' : 'STANDARD';
    return this.repository.create(userData);
  }

  async getAllUsers(): Promise<User[]> {
    return this.repository.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.repository.findById(id);
  }

  async updateUser(id: number, updated: Partial<User>): Promise<User | null> {
    return this.repository.update(id, updated);
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}


