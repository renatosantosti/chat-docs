import { Request, Response, NextFunction } from "express";
import {
  missingParamHttpError,
  unauthorizedHttpError,
} from "../helpers/http-helper";
import IBaseHttpResponse from "@/application/interfaces/base/base-http-response";
import { MissingParamError, UnauthorizedError } from "@/shared/errors";
import { authConfig } from "@/config";

import PasswordHashAdapter from "@/infrastructure/adapters/password-hash-adapter";
import { container } from "tsyringe";
import AuthUserDto from "@/domain/dtos/auth/user";
import IPasswordHashAdapter from "@/application/interfaces/adapters/password-hashing";

const onlyWithAccessAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const passwordHashAdapter = container.resolve(
    "IPasswordHashAdapter",
  ) as IPasswordHashAdapter;
  const token =
    req.cookies.token || req.headers["authorization"]?.split("Bearer ")[1];
  let response: IBaseHttpResponse<Error>;

  if (!token) {
    response = missingParamHttpError(
      new MissingParamError("Token is required"),
    );
    return res.status(response.statusCode).send(response);
  }

  try {
    const validToken = passwordHashAdapter.validateToken(
      token,
      authConfig.secret,
    );
    if (!validToken) {
      response = unauthorizedHttpError(new UnauthorizedError());
      return res.status(response.statusCode).send(response);
    }

    // if alright, go ahead
    const currentUser = await passwordHashAdapter.decodeToken(token ?? "");
    req.currentUser = currentUser! as AuthUserDto;
    return next();
  } catch (error: any) {
    console.error("Unknow Internal Error", {
      details: { module: "middleware::only-access-auth", error: { ...error } },
    });
    response = unauthorizedHttpError(new UnauthorizedError());
    return res.status(response.statusCode).send(response);
  }
};

export default onlyWithAccessAuthMiddleware;
