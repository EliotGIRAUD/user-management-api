import { RabbitConnection } from './RabbitConnection';
import { AppDataSource } from '../datasource';
import { UserCommandRepositoryImpl } from '../../persistence/typeorm/UserCommandRepositoryImpl';
import { UserOrmEntity } from '../../persistence/typeorm/entities/UserOrmEntity';
import type { ConsumeMessage } from 'amqplib';

export class AccountFailureConsumer {
  async start() {
    const ch = await RabbitConnection.getInstance().getChannel();
    const exchange = process.env.RABBITMQ_ACCOUNT_EXCHANGE || 'account.events';
    await ch.assertExchange(exchange, 'topic', { durable: true });
    const queue = 'account.events.AccountCreateFailed';
    await ch.assertQueue(queue, { durable: true });
    await ch.bindQueue(queue, exchange, 'AccountCreateFailed');

    const repo = new UserCommandRepositoryImpl(AppDataSource.getRepository(UserOrmEntity));
    ch.consume(queue, async (msg: ConsumeMessage | null) => {
      if (!msg) return;
      try {
        const evt = JSON.parse(msg.content.toString()) as { userId?: number };
        if (evt.userId) {
          await repo.delete(evt.userId);
        }
        ch.ack(msg);
      } catch (err) {
        ch.nack(msg, false, false);
      }
    });
  }
}


