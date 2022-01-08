import { LoggerService } from "../logger/logger.service";
import { Router, Response } from "express";
import { IRoute } from "./route.interface";

export abstract class BaseController {
  private readonly _router: Router;

  protected constructor(private logger: LoggerService) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  send<T>(res: Response, code: number, message: T) {
    return res.type("application/json").status(code).json(message);
  }

  ok<T>(res: Response, message: T) {
    return this.send<T>(res, 200, message);
  }

  created(res: Response) {
    return res.sendStatus(201);
  }

  protected bindRouters(routes: IRoute[]) {
    for (const route of routes) {
      this.logger.log(`[${route.method}] ${route.path}`);
      const handler = route.func.bind(this);
      this._router[route.method](route.path, handler);
    }
  }
}
