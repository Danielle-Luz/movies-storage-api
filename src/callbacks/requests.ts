import { Request, Response } from "express";
import { database } from "../database";
import { iMessage } from "../interfaces";

export namespace requests {
  export const createMovie = async (request: Request, response: Response) => {
    let status: number;
    let message: iMessage;

    try {
      const { body: newMovie } = request;

      status = 201;
      message = {
        message: "Filme inserido com sucesso.",
      };

      await database.createMovie(newMovie);
    } catch (error) {
      status = 500;
      message = { message: "Erro ao processar a solicitação na base de dados" };
    }
    response.status(status).send(message);
  };
}
