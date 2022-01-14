import { IUserService } from './users.service.interface';
import { UserRegisterDto } from '../dto/user-register.dto';
import { User } from '../entity/user.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { IConfigService } from '../../config/config.service.interface';
import { UsersRepository } from '../repository/users.repository';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserModalType } from '../types';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private userRepository: UsersRepository,
	) {}

	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModalType | null> {
		const newUser = new User(email, name);
		await newUser.setPassword(password, Number(this.configService.get('SALT')));

		const existedUser = await this.userRepository.find(email);
		if (existedUser) {
			return null;
		}

		return this.userRepository.create(newUser);
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		const existedUser = await this.userRepository.find(dto.email);

		if (!existedUser) {
			return false;
		}

		const { name, password, email } = existedUser;

		const user = new User(name, email, password);
		return await user.comparePassword(dto.password);
	}
}
