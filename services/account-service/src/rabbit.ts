import amqplib from 'amqplib';
import type { ConfirmChannel } from 'amqplib';

export class Rabbit {
  private static connection: any | null = null;
  private static channel: ConfirmChannel | null = null;

  static async getChannel(): Promise<ConfirmChannel> {
    if (this.channel) return this.channel;
    const url = process.env.RABBITMQ_URL || 'amqp://localhost';
    this.connection = await amqplib.connect(url);
    // createConfirmChannel exists at runtime; cast to any to avoid TS mismatch with module typings in NodeNext
    this.channel = await (this.connection as any).createConfirmChannel();
    return this.channel as ConfirmChannel;
  }
}


