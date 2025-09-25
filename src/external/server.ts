import 'reflect-metadata';
import express = require('express');
import bodyParser = require('body-parser');
import cors = require('cors');
import { AppDataSource } from './datasource';
import { UserRepositoryImpl } from '../persistence/typeorm/UserRepositoryImpl';
import { UserOrmEntity } from '../persistence/typeorm/entities/UserOrmEntity';
import { createUserRouter } from '../presentation/UserRoutes';

async function bootstrap() {
  await AppDataSource.initialize();
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  app.get('/', (_req, res) => res.send('User Management API (Clean Architecture)'));
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  const repo = new UserRepositoryImpl(AppDataSource.getRepository(UserOrmEntity));
  app.use(createUserRouter(repo));

  app.listen(3000, () => console.log('Server running on port 3000'));
}

bootstrap().catch(err => {
  console.error('Bootstrap error', err);
  process.exit(1);
});


