import { Request } from "express";
import QueryString from "qs";
declare global {
  namespace QueryString {
    export interface ParsedQs {
      [key: string]:
        | undefined
        | string
        | string[]
        | ParsedQs
        | ParsedQs[]
        | number;
    }
  }

  namespace Express {
    interface Request {
      modifiedParams: {
        perPage: number;
        page: number;
        sort: string;
        order: string;
        [key: string]: number | string;
      };
      maxPages: number;
      modifiedMovieId: number;
    }
  }
}
