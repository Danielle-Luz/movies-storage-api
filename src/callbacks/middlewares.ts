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

    if (!hasAllMovieKeys || movieKeys.length !== requestMovieKeys.length) {
      const errorMessage: iMessage = {
        message:
          "O corpo da requisição deve ter as seguintes propriedades: name, description, duration, price",
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
      return requestMovieData[key]?.constructor === movie[key].constructor;
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
        requestMovieData.name + ""
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

  export const checkQueryParams = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const paramsIdealValues = {
      page: {
        idealValues: [1],
        
      },
      perPage: {
        idealValues: [...Array(5).keys()].map(value => value + 1),
        errorMessage: "Só podem haver no mínimo 1 e no máximo 5 itens por página"
      },
      sort: {
        idealValues: ["price", "duration"],
        errorMessage: "Os filmes só podem ser classificados pelos seguintes valores: price ou duration"
      },
      order: {
        idealValues: ["asc", "desc"],
        errorMessage: "Os filmes só podem ser ordenados pelos seguintes valores: asc ou desc",
        dependsOn: "sort"
      }
    }
  }
}
