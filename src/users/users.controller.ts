import { BaseController } from "../common/base.controller";
import { LoggerService } from "../logger/logger.service";
import { Response, Request, NextFunction } from "express";
import { HttpError } from "../errors/http-error.class";

export class UsersController extends BaseController {
  constructor(logger: LoggerService) {
    super(logger);
    this.bindRouters([
      {
        path: "/login",
        method: "get",
        func: this.login,
      },
      {
        path: "/register",
        method: "post",
        func: this.register,
      },
    ]);
  }

  login(req: Request, res: Response, next: NextFunction) {
    next(new HttpError(401, "ошибка при авторизации", "login"));
  }

  register(req: Request, res: Response) {
    this.ok(res, "register");
  }
}
