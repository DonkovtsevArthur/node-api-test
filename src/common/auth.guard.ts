import { IMiddleware } from './middleware.interfaces';
import { NextFunction, Request, Response } from 'express';

export class AuthGuard implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.user) {
			return next();
		} else {
			res.status(401).send({ err: 'Ошибка авторизации' });
		}
	}
}
