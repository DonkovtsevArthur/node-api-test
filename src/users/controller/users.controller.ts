import { BaseController } from '../../common/base.controller';
import { Response, Request, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ILogger } from '../../logger/logget.interface';
import 'reflect-metadata';
import { IUsers } from './users.interface';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegisterDto } from '../dto/user-register.dto';
import { UserService } from '../service/user.service';
import { HttpError } from '../../errors/http-error.class';
import { ValidateMiddleware } from '../../common/validate.middleware';

@injectable()
export class UsersController extends BaseController implements IUsers {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: UserService,
	) {
		super(loggerService);
		this.bindRouters([
			{
				path: '/login',
				method: 'get',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
		]);
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		console.log(body);

		const isLogin = await this.userService.validateUser(body);
		if (isLogin) {
			this.ok(res, { email: body.email });
		}
		return next(new HttpError(401, 'Ошибка авторизации'));
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);

		if (result === null) {
			return next(new HttpError(422, 'Такой пользователь уже существует'));
		}

		this.ok(res, { name: result.name, email: result.email });
	}
}
