import 'reflect-metadata';
import express = require('express');
import bodyParser = require('body-parser');
import cors = require('cors');
import { DataSource } from 'typeorm';
import { AccountOrmEntity } from './typeorm/AccountOrmEntity';
import { Rabbit } from './rabbit';
import type { ConsumeMessage } from 'amqplib';

const PORT = process.env.ACCOUNT_SERVICE_PORT ? Number(process.env.ACCOUNT_SERVICE_PORT) : 3001;

export const AccountDataSource = new DataSource({
  type: 'mysql',
  host: process.env.ACCOUNT_DB_HOST || 'localhost',
  port: +(process.env.ACCOUNT_DB_PORT || 3306),
  username: process.env.ACCOUNT_DB_USER || 'root',
  password: process.env.ACCOUNT_DB_PASSWORD || '',
  database: process.env.ACCOUNT_DB_NAME || 'accountdb',
  synchronize: true,
  logging: false,
  entities: [AccountOrmEntity],
  migrations: [],
  subscribers: [],
});

async function bootstrap() {
  await AccountDataSource.initialize();
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  const repo = AccountDataSource.getRepository(AccountOrmEntity);

  const ch = await Rabbit.getChannel();
  const userExchange = process.env.RABBITMQ_USER_EXCHANGE || 'user.events';
  await ch.assertExchange(userExchange, 'topic', { durable: true });
  // Producer exchange for account events (failures)
  const accountExchange = process.env.RABBITMQ_ACCOUNT_EXCHANGE || 'account.events';
  await ch.assertExchange(accountExchange, 'topic', { durable: true });

  // Consumers: UserCreated
  {
    const queue = 'user.events.UserCreated';
    await ch.assertQueue(queue, { durable: true });
    await ch.bindQueue(queue, userExchange, 'UserCreated');
    ch.consume(queue, async (msg: ConsumeMessage | null) => {
      if (!msg) return;
      try {
        const payload = JSON.parse(msg.content.toString()) as { messageId?: string; user: { id: number } };
        const entity = repo.create({ userId: payload.user.id });
        await repo.save(entity);
        ch.ack(msg);
      } catch (err) {
        try {
          const failEvt = { messageId: (Math.random()*1e18).toString(36), occurredAt: new Date().toISOString(), reason: String(err), userId: (() => { try { return (JSON.parse(msg.content.toString()) as any).user.id; } catch { return undefined; } })() };
          const buf = Buffer.from(JSON.stringify(failEvt));
          await new Promise<void>((resolve, reject) => {
            ch.publish(accountExchange, 'AccountCreateFailed', buf, { contentType: 'application/json', persistent: true }, (e?: any) => e ? reject(e) : resolve());
          });
        } finally {
          ch.nack(msg, false, false); // DLQ policy can be attached to queue
        }
      }
    });
  }
  // Consumers: UserDeletionRequested
  {
    const queue = 'user.events.UserDeletionRequested';
    await ch.assertQueue(queue, { durable: true });
    await ch.bindQueue(queue, userExchange, 'UserDeletionRequested');
    ch.consume(queue, async (msg: ConsumeMessage | null) => {
      if (!msg) return;
      try {
        const payload = JSON.parse(msg.content.toString()) as { userId: number };
        await repo.delete({ userId: payload.userId });
        ch.ack(msg);
      } catch (err) {
        ch.nack(msg, false, false);
      }
    });
  }

  app.post('/accounts', async (req, res) => {
    try {
      const { userId } = req.body as { userId: number };
      const account = repo.create({ userId });
      const saved = await repo.save(account);
      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ message: 'Error creating account', error: String(err) });
    }
  });

  app.delete('/accounts/:id', async (req, res) => {
    const id = Number(req.params.id);
    const result = await repo.delete(id);
    if (result.affected && result.affected > 0) res.sendStatus(204);
    else res.status(404).json({ message: 'Account not found' });
  });

  app.get('/accounts/user/:userId', async (req, res) => {
    const userId = Number(req.params.userId);
    const accounts = await repo.find({ where: { userId } });
    res.json(accounts);
  });

  app.listen(PORT, () => console.log(`Account Service running on port ${PORT}`));
}

bootstrap().catch(err => {
  console.error('Account service bootstrap error', err);
  process.exit(1);
});


