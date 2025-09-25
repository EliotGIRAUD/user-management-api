import 'reflect-metadata';
import { AppDataSource } from './config/ormconfig.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { UserController } from './controllers/UserController.js';

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');

    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    app.post('/users', UserController.createUser);
    app.get('/users', UserController.getAllUsers);
    app.get('/users/:id', UserController.getUserById);
    app.put('/users/:id', UserController.updateUser);
    app.delete('/users/:id', UserController.deleteUser);

    app.listen(3000, () => console.log('Server running on port 3000'));
  })
  .catch(err => console.error('Error during Data Source initialization', err));
