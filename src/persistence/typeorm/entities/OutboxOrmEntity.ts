import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'outbox' })
export class OutboxOrmEntity {
  @PrimaryColumn('varchar', { length: 36 })
  id!: string; // uuid

  @Column('varchar')
  aggregateType!: string; // e.g. 'User'

  @Column('bigint')
  aggregateId!: number;

  @Column('varchar')
  eventType!: string; // e.g. 'UserCreated'

  @Column('json')
  payload!: unknown;

  @Column('varchar', { default: 'PENDING' })
  status!: 'PENDING' | 'SENT' | 'FAILED';

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}


