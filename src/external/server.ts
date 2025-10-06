import 'reflect-metadata';
import express = require('express');
import bodyParser = require('body-parser');
import cors = require('cors');
import { AppDataSource } from './datasource';
import { UserCommandRepositoryImpl } from '../persistence/typeorm/UserCommandRepositoryImpl';
import { UserQueryRepositoryImpl } from '../persistence/typeorm/UserQueryRepositoryImpl';
import { AccountServiceAdapter } from './http/AccountServiceAdapter';
import { UserOrmEntity } from '../persistence/typeorm/entities/UserOrmEntity';
import { createAggregationRouter, createUserRouter } from '../presentation/UserRoutes';
import { OutboxDispatcher } from './http/OutboxDispatcher';
import { AccountFailureConsumer } from './http/AccountFailureConsumer';

async function bootstrap() {
  await AppDataSource.initialize();
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  app.get('/', (_req, res) => res.send('User Management API (Clean Architecture)'));
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  const commandRepo = new UserCommandRepositoryImpl(AppDataSource.getRepository(UserOrmEntity));
  const queryRepo = new UserQueryRepositoryImpl(AppDataSource.getRepository(UserOrmEntity));
  const accounts = new AccountServiceAdapter();
  app.use(createUserRouter(commandRepo, queryRepo, accounts));
  app.use(createAggregationRouter(queryRepo, accounts));

  const dispatcher = new OutboxDispatcher();
  dispatcher.start(1000);

  // Start failure consumer (compensation)
  const failureConsumer = new AccountFailureConsumer();
  await failureConsumer.start();

  app.listen(3000, () => console.log('Server running on port 3000'));
}

bootstrap().catch(err => {
  console.error('Bootstrap error', err);
  process.exit(1);
});


