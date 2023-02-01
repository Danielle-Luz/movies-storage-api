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

  export const getAllMovies = async (request: Request, response: Response) => {
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
}
