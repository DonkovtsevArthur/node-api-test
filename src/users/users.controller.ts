import { BaseController } from '../common/base.controller';
import { Response, Request } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logget.interface';
import 'reflect-metadata';
import { IUsers } from './users.interface';

@injectable()
export class UsersController extends BaseController implements IUsers {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService);
		this.bindRouters([
			{
				path: '/login',
				method: 'get',
				func: this.login,
			},
			{
				path: '/register',
				method: 'post',
				func: this.register,
			},
		]);
	}

	login(req: Request, res: Response): void {
		this.ok(res, 'login');
	}

	register(req: Request, res: Response): void {
		this.ok(res, 'register');
	}
}
