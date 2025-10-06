import type { User } from '../../../domain/entities/User';
import { UserOrmEntity } from '../entities/UserOrmEntity';

export const mapOrmToDomain = (orm: UserOrmEntity): User => ({
  id: orm.id,
  firstName: orm.firstName,
  lastName: orm.lastName,
  email: orm.email,
  phone: orm.phone,
  profile: orm.profile as any,
});

export const mapDomainToOrm = (user: User): UserOrmEntity => {
  const orm = new UserOrmEntity();
  orm.id = user.id;
  orm.firstName = user.firstName;
  orm.lastName = user.lastName;
  orm.email = user.email;
  orm.phone = user.phone;
  orm.profile = user.profile as any;
  return orm;
};


