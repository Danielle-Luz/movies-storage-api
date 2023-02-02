import { iPagination } from "./../interfaces";
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
    const sort = (request.query["sort"] as string) || "id";
    const { moviesQuantity } = request;

    const moviesFound = await database.getMoviesWithFilters(
      perPage,
      page,
      order,
      sort
    );
    
    const maxPages = moviesQuantity / perPage;
    const previousPage =
      page > 1
        ? `http://localhost:3000/movies?page=${page - 1}&perPage=${perPage}`
        : null;
    const nextPage =
      page < maxPages
        ? `http://localhost:3000/movies?page=${page + 1}&perPage=${perPage}`
        : null;

    const pagination: iPagination = {
      previousPage,
      nextPage,
      count: moviesFound.length,
      data: moviesFound,
    };
    
    return response.status(200).send(pagination);
  };
}
