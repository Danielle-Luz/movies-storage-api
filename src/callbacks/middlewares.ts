import { NextFunction, Request, Response } from "express";

export namespace middlewares {
  export const checkMovieProperties = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {};

  export const checkMoviePropertiesTypes = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {};

  export const checkIfNameAlreadyExists = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {};
}
