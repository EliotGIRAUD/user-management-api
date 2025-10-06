import amqplib from 'amqplib';
import type { ConfirmChannel } from 'amqplib';

export class RabbitConnection {
  private static instance: RabbitConnection | null = null;
  private connection: any | null = null;
  private channel: ConfirmChannel | null = null;

  private constructor() {}

  static getInstance(): RabbitConnection {
    if (!this.instance) this.instance = new RabbitConnection();
    return this.instance;
  }

  async getChannel(): Promise<ConfirmChannel> {
    if (this.channel) return this.channel;
    const url = process.env.RABBITMQ_URL || 'amqp://localhost';
    this.connection = await amqplib.connect(url);
    this.channel = await (this.connection as any).createConfirmChannel();
    return this.channel as ConfirmChannel;
  }
}


