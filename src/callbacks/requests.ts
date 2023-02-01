import { Request, Response } from "express";
import { database } from "../database";
import { iMessage } from "../interfaces";

export namespace requests {
  export const createMovie = async (request: Request, response: Response) => {

    try {
      const { body: newMovie } = request;

      const createdMovie = await database.createMovie(newMovie);

      return response.status(201).json(createdMovie);
    } catch (error) {
      const message: iMessage = { message: "Erro ao processar a solicitação na base de dados" };
      response.status(500).send(message);
    }
  };

  export const getAllMovies = async (request: Request, Response: Response) => {
    
  }
}
