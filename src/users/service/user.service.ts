import { IUserService } from './users.service.interface';
import { UserRegisterDto } from '../dto/user-register.dto';
import { User } from '../entity/user.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { IConfigService } from '../../config/config.service.interface';
import { UsersRepository } from '../repository/users.repository';
import { UserLoginDto } from '../dto/user-login.dto';
// @ts-ignore
import { UserModel } from '@prisma/client';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private userRepository: UsersRepository,
	) {}
	async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
		const newUser = new User(email, name);
		await newUser.setPassword(password, Number(this.configService.get('SALT')));

		const existedUser = await this.userRepository.find(email);
		if (existedUser) {
			return null;
		}

		return await this.userRepository.create(newUser);
	}

	async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const existedUser: UserModel = await this.userRepository.find(email);
		const user = new User(email);
		return (await user.compare(password, existedUser.password)) && user.email === existedUser.email;
	}
}
