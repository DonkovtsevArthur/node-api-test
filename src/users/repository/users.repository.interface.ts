import { User } from '../entity/user.entity';
//@ts-ignore
import { UserModel } from '@prisma/client';

export interface IUsersRepository {
	create: (user: User) => Promise<UserModel>;
	find: (email: string) => Promise<UserModel | null>;
}
