import { BaseController } from '../../common/base.controller';
import { Response, Request, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ILogger } from '../../logger/logget.interface';
import 'reflect-metadata';
import { sign } from 'jsonwebtoken';
import { IUsers } from './users.interface';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegisterDto } from '../dto/user-register.dto';
import { UserService } from '../service/user.service';
import { HttpError } from '../../errors/http-error.class';
import { ValidateMiddleware } from '../../common/validate.middleware';
import { ConfigService } from '../../config/config.service';
import { AuthGuard } from '../../common/auth.guard';

@injectable()
export class UsersController extends BaseController implements IUsers {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: UserService,
		@inject(TYPES.IConfigService) private configService: ConfigService,
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
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
			},
		]);
	}

	private async singJWT(email: string, secret: string): Promise<string> {
		return new Promise((res, rej) => {
			sign(
				{ email, iat: Math.floor(Date.now() / 1000) - 30 },
				secret,
				{ algorithm: 'HS256' },
				(err, token) => {
					if (err) {
						return rej(err);
					} else if (token) {
						res(token);
					}
				},
			);
		});
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const isLogin = await this.userService.validateUser(body);

		if (isLogin) {
			const jwt = await this.singJWT(body.email, this.configService.get('SECRET'));
			this.ok(res, { jwt });
		} else {
			next(new HttpError(401, 'Ошибка авторизации'));
		}
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

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const info = await this.userService.getUserInfo(user);
		if (info) {
			this.ok(res, { id: info.id });
		}
	}
}
