import { BaseController } from "../common/base.controller";
import { LoggerService } from "../logger/logger.service";
import { Response, Request } from "express";

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

  login(req: Request, res: Response) {
    this.ok(res, "login");
  }

  register(req: Request, res: Response) {
    this.ok(res, "register");
  }
}
