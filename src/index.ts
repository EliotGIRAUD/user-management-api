import 'reflect-metadata';
import { AppDataSource } from './config/ormconfig';
import express = require('express');
import type { Request, Response } from 'express';
import bodyParser = require('body-parser');
import cors = require('cors');
import { UserController } from './controllers/UserController';

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');

    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    app.get('/', (_req: Request, res: Response) => {
      res.send('User Management API is running');
    });

    app.get('/health', (_req: Request, res: Response) => {
      res.json({ status: 'ok' });
    });

    app.post('/users', UserController.createUser);
    app.get('/users', UserController.getAllUsers);
    app.get('/users/:id', UserController.getUserById);
    app.put('/users/:id', UserController.updateUser);
    app.delete('/users/:id', UserController.deleteUser);

    app.listen(3000, () => console.log('Server running on port 3000'));
  })
  .catch((err: unknown) => console.error('Error during Data Source initialization', err));
