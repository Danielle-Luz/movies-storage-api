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

  export const updateMovie = async (request: Request, response: Response) => {
    const { movieId, body: updatedMovieData } = request;

    try {
      const updatedMovie = await database.updateMovie(
        updatedMovieData,
        movieId
      );

      return response.status(200).send(updatedMovie);
    } catch {
      const errorMessage: iMessage = {
        message: "Não foi possível atualizar o filme.",
      };

      return response.status(500).send(errorMessage);
    }
  };

  export const getMoviesByPage = async (
    request: Request,
    response: Response
  ) => {
    const perPage = request.modifiedParams.perPage;
    const page = request.modifiedParams.page;
    const sort = request.modifiedParams.sort;
    const order = request.modifiedParams.order;
    const maxPages = request.maxPages;

    const moviesFound = await database.getMoviesWithFilters(
      perPage,
      page,
      order,
      sort
    );

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

  export const deleteMovie = async (request: Request, response: Response) => {
    const { movieId } = request;

    try {
      await database.deleteMovie(movieId);

      return response.status(204).send();
    } catch (error) {
      const errorMessage: iMessage = {
        message: "Não foi possível excluir o filme",
      };

      return response.status(500).send(errorMessage);
    }
  };
}
