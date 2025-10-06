import fetch from 'node-fetch';

export class AccountClient {
  constructor(private readonly baseUrl: string = process.env.ACCOUNT_SERVICE_URL || 'http://localhost:3001') {}

  async createAccount(userId: number): Promise<{ id: number; userId: number }> {
    const res = await fetch(`${this.baseUrl}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) throw new Error(`Account create failed: ${res.status}`);
    return (await res.json()) as { id: number; userId: number };
  }

  async deleteAccount(accountId: number): Promise<void> {
    const res = await fetch(`${this.baseUrl}/accounts/${accountId}`, { method: 'DELETE' });
    if (res.status !== 204) throw new Error(`Account delete failed: ${res.status}`);
  }

  async getAccountsByUser(userId: number): Promise<Array<{ id: number; userId: number }>> {
    const res = await fetch(`${this.baseUrl}/accounts/user/${userId}`);
    if (!res.ok) throw new Error(`Account list failed: ${res.status}`);
    return (await res.json()) as Array<{ id: number; userId: number }>;
  }
}


