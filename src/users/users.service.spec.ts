import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './repository/users.repository.interface';
import { IUserService } from './service/users.service.interface';
import { UserService } from './service/user.service';
import { TYPES } from '../types';
import { UserModelType } from './types';
import { User } from './entity/user.entity';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUserService;

beforeAll(() => {
	container.bind<UserService>(TYPES.UserService).to(UserService);
	container.bind<IConfigService>(TYPES.IConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.IConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	usersService = container.get<IUserService>(TYPES.UserService);
});

// let createdUser: UserModelType | null;

describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValue('1');
		usersRepository.create = createUserMock();
		const createdUser = await createUserService();

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('1');
	});

	it('validateUser - success', async () => {
		usersRepository.create = createUserMock();
		const createdUser = await createUserService();

		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);

		const res = await usersService.validateUser({
			email: 'tests@tests.ru',
			password: '1',
		});

		expect(res).toBeTruthy();
	});

	it('validateUser - wrong password', async () => {
		usersRepository.create = createUserMock();
		const createdUser = await createUserService();

		usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);

		const res = await usersService.validateUser({
			email: 'tests@tests.ru',
			password: '2',
		});

		expect(res).toBeFalsy();
	});

	it('validateUser - wrong user', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);

		const res = await usersService.validateUser({
			email: 'tests@tests.ru',
			password: '1',
		});

		expect(res).toBeFalsy();
	});
});

function createUserMock() {
	return jest.fn().mockImplementationOnce(
		(user: User): UserModelType => ({
			name: user.name,
			email: user.email,
			password: user.password,
			id: 1,
		}),
	);
}

async function createUserService() {
	return await usersService.createUser({
		email: 'tests@tests.ru',
		name: 'Vasia',
		password: '1',
	});
}
