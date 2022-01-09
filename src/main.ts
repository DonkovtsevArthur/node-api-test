import { App } from './app';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';
import { ExceptionFilter } from './errors/exception.filter';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import { ILogger } from './logger/logget.interface';
import { UserService } from './users/user.service';

type Bootstrap = {
	appContainer: Container;
	app: App;
};

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService);
	bind<ExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<UsersController>(TYPES.UsersController).to(UsersController);
	bind<UserService>(TYPES.UserService).to(UserService);
	bind<App>(TYPES.App).to(App);
});

const bootstrap = (): Bootstrap => {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.App);
	app.init();
	return { app, appContainer };
};

export const { app, appContainer } = bootstrap();
