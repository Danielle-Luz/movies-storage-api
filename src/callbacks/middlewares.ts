import { database } from "./../database";
import { iMessage, iMovie, tCreateMovie } from "./../interfaces";
import { NextFunction, request, Request, Response } from "express";

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
    const errorMessage: iMessage = {
      message:
        request.method === "PATCH"
          ? "O corpo da requisição só pode possuir uma ou mais das seguintes propriedades: name, description, duration e price"
          : "O corpo da requisição deve ter as seguintes propriedades obrigatórias: name, duration e price, podendo ter a seguinte propriedade opcional: description",
    };

    const { body: requestMovieData } = request;

    const requestMovieKeys = Object.keys(requestMovieData);

    const wrongKeys = requestMovieKeys.filter(
      (key) => !movieKeys.includes(key)
    );

    if (wrongKeys.length !== 0) {
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

    const requestMovieDataKeys = Object.keys(requestMovieData);

    const rightMovieTypes: string[] = [];

    const keysWithWrongTypes = requestMovieDataKeys.filter((key) => {
      const rightMovieType = movie[key].constructor;

      rightMovieTypes.push(rightMovieType.name.toLowerCase());

      return requestMovieData[key]?.constructor !== rightMovieType;
    });

    if (keysWithWrongTypes.length !== 0) {
      const errorMessage: iMessage = {
        message: `As propriedades no corpo da requisição devem ter os seguintes tipos: ${rightMovieTypes.join(
          ", "
        )}`,
      };
      return response.status(400).send(errorMessage);
    }

    return next();
  };

  export const checkMovieIdType = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { movieId } = request.params;
    const idAsNumber = Number(movieId);

    if (isNaN(idAsNumber) || idAsNumber < 1 || idAsNumber % 1 !== 0) {
      const errorMessage: iMessage = {
        message: "O id do filme deve ser um número inteiro positivo",
      };

      return response.status(400).send(errorMessage);
    }

    request.movieId = idAsNumber;

    next();
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

  export const checkUpdatedName = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { body: updatedMovieData } = request;

    if (updatedMovieData?.name) {
      await checkIfNameAlreadyExists(request, response, next);
    } else {
      next();
    }
  };

  export const checkQueryParams = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    request.modifiedParams = { perPage: 0, page: 0, sort: "", order: "" };

    const perPage = Number(request.query?.perPage);
    const page = Number(request.query?.page);
    const order = (request.query?.order as string)?.toUpperCase();
    const sort = (request.query?.sort as string)?.toLowerCase();

    const sortAllowedColumns = ["price", "duration"];
    const orderDirectionsAvailable = ["ASC", "DESC"];

    const moviesQuantity = (await database.getMoviesQuantity()) as number;
    request.maxPages = Math.ceil(moviesQuantity / perPage);

    request.modifiedParams.page =
      isNaN(page) || page < 1 || page > request.maxPages ? 1 : page;
    request.modifiedParams.perPage =
      isNaN(perPage) || perPage < 1 || perPage > 5 ? 5 : perPage;
    request.modifiedParams.sort = !sortAllowedColumns.includes(sort)
      ? "id"
      : sort;
    request.modifiedParams.order =
      !sortAllowedColumns.includes(sort) ||
      !orderDirectionsAvailable.includes(order)
        ? "ASC"
        : order;

    next();
  };

  export const checkIfIdExists = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { movieId } = request;

    const movieExists = await database.getMovieById(movieId);

    if (!movieExists) {
      const errorMessage: iMessage = {
        message: "O filme com o id indicado não foi encontrado",
      };

      return response.status(404).send(errorMessage);
    }

    next();
  };
}
