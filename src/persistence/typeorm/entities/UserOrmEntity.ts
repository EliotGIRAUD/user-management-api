import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'user' })
export class UserOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  phone!: string;

  @Column({ type: 'enum', enum: ['ADMIN', 'STANDARD'], default: 'STANDARD' })
  profile!: 'ADMIN' | 'STANDARD';
}


