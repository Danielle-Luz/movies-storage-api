import { database } from "./../database";
import { iMessage, iMovie, tCreateMovie } from "./../interfaces";
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
    const { body: requestMovieData } = request;

    const requestMovieKeys = Object.keys(requestMovieData);

    const hasAllMovieKeys = requestMovieKeys.every((key) => {
      return movieKeys.includes(key);
    });

    if (!hasAllMovieKeys) {
      const errorMessage: iMessage = {
        message:
          "O corpo da requisição debe ter as seguintes propriedades: name, description, duration, price",
      };

      return response.status(400).send(errorMessage);
    }

    return next();
  };

  export const checkMoviePropertiesTypes = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { body: requestMovieData } = request;

    const hasSameTypes = movieKeys.every((key) => {
      return requestMovieData[key].constructor === movie[key].constructor;
    });

    if (!hasSameTypes) {
      const errorMessage: iMessage = {
        message:
          "As propriedades no corpo da requisição devem ter os seguintes tipos: string, string, number, number",
      };
      return response.status(400).send(errorMessage);
    }

    return next();
  };

  export const checkIfNameAlreadyExists = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { body: requestMovieData } = request;

    try {
      const foundMovie: iMovie[] | undefined = await database.getMovieByName(
        requestMovieData.name
      );

      if (foundMovie?.length !== 0) {
        const errorMessage: iMessage = {
          message: "Não é possível cadastrar mais de um filme com o mesmo nome",
        };

        return response.status(409).send(errorMessage);
      }

      next();
    } catch (error) {
      return response.status(500).send("Erro ao processar a solicitação");
    }
  };
}
