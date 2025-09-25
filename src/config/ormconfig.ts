import { DataSource } from 'typeorm';
import { User } from '../models/UserEntity.js';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'userdb',
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
});
