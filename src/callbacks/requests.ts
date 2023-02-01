import { Request, Response } from "express";

export namespace requests {
  export const createMovie = (request: Request, response: Response) => {
    const { body } = request;
  };
}
