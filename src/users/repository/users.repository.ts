import { IUsersRepository } from './users.repository.interface';

import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { PrismaService } from '../../database/prisma.service';
import { User } from '../entity/user.entity';
import { UserModalType } from '../types';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	create = async ({ name, password, email }: User): Promise<UserModalType> => {
		return await this.prismaService.client.userModal.create({ data: { name, password, email } });
	};

	find = async (email: string): Promise<UserModalType | null> => {
		return await this.prismaService.client.userModal.findFirst({ where: { email } });
	};
}
