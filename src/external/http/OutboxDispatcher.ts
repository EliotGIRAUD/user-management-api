import { AppDataSource } from '../datasource';
import { OutboxOrmEntity } from '../../persistence/typeorm/entities/OutboxOrmEntity';
import { RabbitConnection } from './RabbitConnection';

export class OutboxDispatcher {
  private intervalHandle: NodeJS.Timeout | null = null;

  start(intervalMs = 1000) {
    if (this.intervalHandle) return;
    this.intervalHandle = setInterval(() => this.tick().catch(() => {})), intervalMs;
  }

  stop() {
    if (!this.intervalHandle) return;
    clearInterval(this.intervalHandle);
    this.intervalHandle = null;
  }

  private async tick() {
    const repo = AppDataSource.getRepository(OutboxOrmEntity);
    const pendings = await repo.find({ where: { status: 'PENDING' }, take: 20, order: { createdAt: 'ASC' } });
    if (pendings.length === 0) return;
    const ch = await RabbitConnection.getInstance().getChannel();
    await ch.assertExchange(process.env.RABBITMQ_USER_EXCHANGE || 'user.events', 'topic', { durable: true });
    for (const evt of pendings) {
      try {
        const routingKey = evt.eventType;
        const payload = Buffer.from(JSON.stringify(evt.payload));
        await new Promise<void>((resolve, reject) => {
          ch.publish(
            process.env.RABBITMQ_USER_EXCHANGE || 'user.events',
            routingKey,
            payload,
            { contentType: 'application/json', persistent: true },
            (err?: any) => { if (err) reject(err); else resolve(); }
          );
        });
        await repo.update({ id: evt.id }, { status: 'SENT' });
      } catch (err) {
        await repo.update({ id: evt.id }, { status: 'FAILED' });
      }
    }
  }
}


