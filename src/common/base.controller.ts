import { Router, Response } from 'express';
import { ExpressReturnType, IRoute } from './route.interface';
import { ILogger } from '../logger/logget.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';

// @ts-ignore
@injectable()
export abstract class BaseController {
	readonly _router: Router;

	protected constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	send<T>(res: Response, code: number, message: T): ExpressReturnType {
		return res.type('application/json').status(code).json(message);
	}

	ok<T>(res: Response, message: T): ExpressReturnType {
		return this.send<T>(res, 200, message);
	}

	created(res: Response): ExpressReturnType {
		return res.sendStatus(201);
	}

	protected bindRouters(routes: IRoute[]): void {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${route.path}`);
			const middleware = route.middlewares?.map((m) => m.execute.bind(m));
			const handler = route.func.bind(this);

			const pipeline = middleware ? [...middleware, handler] : handler;
			this._router[route.method](route.path, pipeline);
		}
	}
}
