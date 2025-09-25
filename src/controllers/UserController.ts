import type { Request, Response } from 'express';
import { UserService } from '../services/UserService.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { User } from '../models/UserEntity.js';

// Initialisation du repository et du service
const repo = new UserRepository();
const service = new UserService(repo);

export class UserController {
  static async createUser(req: Request, res: Response) {
    try {
      const userData: User = req.body;
      const user = await service.createUser(userData);
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ message: 'Error creating user', error: err });
    }
  }

  static async getAllUsers(req: Request, res: Response) {
    const users = await service.getAllUsers();
    res.json(users);
  }

  static async getUserById(req: Request, res: Response) {
    const user = await service.getUserById(Number(req.params.id));
    if (user) res.json(user);
    else res.status(404).json({ message: 'User not found' });
  }

  static async updateUser(req: Request, res: Response) {
    const updated = await service.updateUser(Number(req.params.id), req.body);
    if (updated) res.json(updated);
    else res.status(404).json({ message: 'User not found' });
  }

  static async deleteUser(req: Request, res: Response) {
    const deleted = await service.deleteUser(Number(req.params.id));
    if (deleted) res.sendStatus(204);
    else res.status(404).json({ message: 'User not found' });
  }
}
