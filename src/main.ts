import { App } from './app';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/controller/users.controller';
import { ExceptionFilter } from './errors/exception.filter';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger/logget.interface';
import { UserService } from './users/service/user.service';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { PrismaService } from './database/prisma.service';
import { UsersRepository } from './users/repository/users.repository';

type Bootstrap = {
	appContainer: Container;
	app: App;
};

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService);
	bind<ExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<UsersController>(TYPES.UsersController).to(UsersController);
	bind<UserService>(TYPES.UserService).to(UserService);
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<UsersRepository>(TYPES.UsersRepository).to(UsersRepository).inSingletonScope();
	bind<App>(TYPES.App).to(App);
});

const bootstrap = async (): Promise<Bootstrap> => {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.App);
	await app.init();
	return { app, appContainer };
};

export const boot = bootstrap();
