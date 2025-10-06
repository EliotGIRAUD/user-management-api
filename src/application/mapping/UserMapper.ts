import type { User } from '../../domain/entities/User';
import type { CreateUserInputDTO } from '../dto/CreateUserInputDTO';
import type { UpdateUserInputDTO } from '../dto/UpdateUserInputDTO';
import type { UserViewDTO } from '../dto/UserViewDTO';

export const mapCreateInputToDomain = (input: CreateUserInputDTO): Omit<User, 'id' | 'profile'> => ({
  firstName: input.firstName,
  lastName: input.lastName,
  email: input.email,
  phone: input.phone,
});

export const mapUpdateInputToDomain = (input: UpdateUserInputDTO): Partial<User> => ({
  ...(input.firstName !== undefined ? { firstName: input.firstName } : {}),
  ...(input.lastName !== undefined ? { lastName: input.lastName } : {}),
  ...(input.email !== undefined ? { email: input.email } : {}),
  ...(input.phone !== undefined ? { phone: input.phone } : {}),
});

export const mapDomainToView = (user: User): UserViewDTO => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  profile: user.profile,
});



