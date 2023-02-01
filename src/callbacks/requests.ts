import { Request, Response } from "express";
import { database } from "../database";
import { iMessage } from "../interfaces";

export namespace requests {
  export const createMovie = (request: Request, response: Response) => {
    const { body: newMovie } = request;
    const sucessMessage: iMessage = { message: "Filme inserido com sucesso." };

    database.createMovie(newMovie);

    response.status(201).send(sucessMessage);
  };
}
