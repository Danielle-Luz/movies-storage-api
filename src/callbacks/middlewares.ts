import { iMovie, tCreateMovie } from "./../interfaces";
import { NextFunction, Request, Response } from "express";

export namespace middlewares {
  const movie: tCreateMovie = {
    name: "",
    description: "",
    duration: 0,
    price: 0,
  };
  const movieKeys: string[] = Object.keys(movie);

  export const checkMovieKeys = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { body } = request;

    const requestMovieKeys = Object.keys(body);

    const hasAllMovieKeys = requestMovieKeys.every((key) => {
      return movieKeys.includes(key);
    });

    return hasAllMovieKeys;
  };

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
