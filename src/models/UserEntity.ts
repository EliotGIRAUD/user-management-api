import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type Profile = 'ADMIN' | 'STANDARD';

@Entity()
export class User {
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
  profile!: Profile;
}
