import { IUsersRepository } from './users.repository.interface';
// @ts-ignore
import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { PrismaService } from '../../database/prisma.service';
import { User } from '../entity/user.entity';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create({ password, email, name }: User): Promise<UserModel> {
		return await this.prismaService.client.userModal.create({ data: { password, email, name } });
	}

	async find(email: string): Promise<UserModel | null> {
		return await this.prismaService.client.userModal.findFirst({ where: { email } });
	}
}
