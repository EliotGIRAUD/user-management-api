export interface AccountServicePort {
  createAccount(userId: number): Promise<{ id: number; userId: number }>;
  deleteAccount(accountId: number): Promise<void>;
  getAccountsByUser(userId: number): Promise<Array<{ id: number; userId: number }>>;
}


