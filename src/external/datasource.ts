import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { UserOrmEntity } from '../persistence/typeorm/entities/UserOrmEntity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'userdb',
  synchronize: true,
  logging: false,
  entities: [UserOrmEntity],
  migrations: [],
  subscribers: [],
});


