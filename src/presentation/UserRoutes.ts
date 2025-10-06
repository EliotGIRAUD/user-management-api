import { Router, type Request, type Response } from 'express';
import { CreateUser } from '../application/usecases/CreateUser';
import { GetAllUsers } from '../application/usecases/GetAllUsers';
import { GetUserById } from '../application/usecases/GetUserById';
import { UpdateUser } from '../application/usecases/UpdateUser';
import { DeleteUser } from '../application/usecases/DeleteUser';
import type { UserRepositoryPort } from '../application/ports/UserRepositoryPort';
import type { CreateUserInputDTO } from '../application/dto/CreateUserInputDTO';
import type { UpdateUserInputDTO } from '../application/dto/UpdateUserInputDTO';

export function createUserRouter(repo: UserRepositoryPort): Router {
  const router = Router();
  const createUser = new CreateUser(repo);
  const getAllUsers = new GetAllUsers(repo);
  const getUserById = new GetUserById(repo);
  const updateUser = new UpdateUser(repo);
  const deleteUser = new DeleteUser(repo);

  router.post('/users', async (req: Request, res: Response) => {
    try {
      const input = req.body as CreateUserInputDTO;
      const created = await createUser.execute(input);
      res.status(201).json(created);
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
    const input = req.body as UpdateUserInputDTO;
    const updated = await updateUser.execute(Number(req.params.id), input);
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


