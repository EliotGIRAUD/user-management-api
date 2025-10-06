import type { AccountServicePort } from '../../application/ports/AccountServicePort';
import { AccountClient } from './AccountClient';

export class AccountServiceAdapter implements AccountServicePort {
  constructor(private readonly client = new AccountClient()) {}

  createAccount(userId: number) {
    return this.client.createAccount(userId);
  }
  deleteAccount(accountId: number) {
    return this.client.deleteAccount(accountId);
  }
  getAccountsByUser(userId: number) {
    return this.client.getAccountsByUser(userId);
  }
}


