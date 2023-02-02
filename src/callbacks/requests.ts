import { Request, response, Response } from "express";
import { database } from "../database";
import { iMessage } from "../interfaces";

export namespace requests {
  export const createMovie = async (request: Request, response: Response) => {
    try {
      const { body: newMovie } = request;

      const createdMovie = await database.createMovie(newMovie);

      return response.status(201).json(createdMovie);
    } catch (error) {
      const errorMessage: iMessage = {
        message: "Erro ao processar a solicitação na base de dados",
      };
      response.status(500).send(errorMessage);
    }
  };

  export const getMovies = async (request: Request, response: Response) => {
    try {
      const allMovies = await database.getAllMovies();

      return response.status(200).send(allMovies);
    } catch (error) {
      const errorMessage: iMessage = {
        message:
          "Não foi possível recuperar os dados dos filmes na base de dados",
      };

      return response.status(500).send(errorMessage);
    }
  };

  export const getMoviesByPage = async (
    request: Request,
    response: Response
  ) => {
    const perPage = request.convertedNumberParams?.perPage || 5;
    const page = request.convertedNumberParams?.page || 1;
    const order = (request.query["order"] as string) || "asc";
    const sort = (request.query["sort"] as string) || "";

    const moviesFound = await database.getMoviesWithFilters(
      perPage,
      page,
      order,
      sort
    );

    return response.status(200).send(moviesFound);
  };
}
