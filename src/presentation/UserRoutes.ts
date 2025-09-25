import { Router, type Request, type Response } from 'express';
import { CreateUser } from '../application/usecases/CreateUser';
import { GetAllUsers } from '../application/usecases/GetAllUsers';
import { GetUserById } from '../application/usecases/GetUserById';
import { UpdateUser } from '../application/usecases/UpdateUser';
import { DeleteUser } from '../application/usecases/DeleteUser';
import type { UserRepositoryPort } from '../application/ports/UserRepositoryPort';

export function createUserRouter(repo: UserRepositoryPort): Router {
  const router = Router();
  const createUser = new CreateUser(repo);
  const getAllUsers = new GetAllUsers(repo);
  const getUserById = new GetUserById(repo);
  const updateUser = new UpdateUser(repo);
  const deleteUser = new DeleteUser(repo);

  router.post('/users', async (req: Request, res: Response) => {
    try {
      const user = await createUser.execute(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ message: 'Error creating user', error: err });
    }
  });

  router.get('/users', async (_req: Request, res: Response) => {
    const users = await getAllUsers.execute();
    res.json(users);
  });

  router.get('/users/:id', async (req: Request, res: Response) => {
    const user = await getUserById.execute(Number(req.params.id));
    if (user) res.json(user);
    else res.status(404).json({ message: 'User not found' });
  });

  router.put('/users/:id', async (req: Request, res: Response) => {
    const updated = await updateUser.execute(Number(req.params.id), req.body);
    if (updated) res.json(updated);
    else res.status(404).json({ message: 'User not found' });
  });

  router.delete('/users/:id', async (req: Request, res: Response) => {
    const deleted = await deleteUser.execute(Number(req.params.id));
    if (deleted) res.sendStatus(204);
    else res.status(404).json({ message: 'User not found' });
  });

  // Notes: pour compléter, ajouter GET/PUT/DELETE via d'autres use cases

  return router;
}


