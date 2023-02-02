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
}
