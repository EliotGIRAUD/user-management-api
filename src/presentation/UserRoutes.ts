import { Router, type Request, type Response } from 'express';
import { CreateUserCommand } from '../application/usecases/commands/CreateUser';
import { UpdateUserCommand } from '../application/usecases/commands/UpdateUser';
import { DeleteUserCommand } from '../application/usecases/commands/DeleteUser';
import { GetAllUsersQuery } from '../application/usecases/queries/GetAllUsers';
import { GetUserByIdQuery } from '../application/usecases/queries/GetUserById';
import type { UserCommandRepositoryPort } from '../application/ports/UserCommandRepositoryPort';
import type { UserQueryRepositoryPort } from '../application/ports/UserQueryRepositoryPort';
import type { CreateUserInputDTO } from '../application/dto/CreateUserInputDTO';
import type { UpdateUserInputDTO } from '../application/dto/UpdateUserInputDTO';

export function createUserRouter(commandRepo: UserCommandRepositoryPort, queryRepo: UserQueryRepositoryPort): Router {
  const router = Router();
  const createUser = new CreateUserCommand(commandRepo);
  const updateUser = new UpdateUserCommand(commandRepo);
  const deleteUser = new DeleteUserCommand(commandRepo);
  const getAllUsers = new GetAllUsersQuery(queryRepo);
  const getUserById = new GetUserByIdQuery(queryRepo);

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


