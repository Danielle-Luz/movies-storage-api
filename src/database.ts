import { throws } from "assert";
import { Client, QueryResult } from "pg";
import { format } from "node-pg-format";
import { iMovie, tCreateMovie } from "./interfaces";

export namespace database {
  const connection = new Client({
    user: "postgres",
    password: "12345",
    host: "localhost",
    database: "postgres",
    port: 5432,
  });

  export const openConnection = async () => {
    await connection.connect();

    console.log("Connection opened");
  };

  export const getMovieByName = async (searchedName: string) => {
    const queryString = format(
      "SELECT * FROM movies WHERE LOWER(name) = LOWER(%L)",
      searchedName
    );

    const resultQuery: QueryResult<iMovie> = await connection.query(
      queryString
    );

    const movieFound: iMovie[] = resultQuery.rows;

    return movieFound;
  };

  export const createMovie = async (newMovie: tCreateMovie) => {
    const movieKeys = Object.keys(newMovie);
    const movieData = Object.values(newMovie);

    const queryString = format(
      `
      INSERT INTO movies(%I) VALUES(%L)
      RETURNING *
      `,
      movieKeys,
      movieData
    );
  
    const queryResult: QueryResult<iMovie> = await connection.query(
      queryString
    );

    return queryResult.rows[0];
  };

  export const getAllMovies = async () => {
    const queryString = "SELECT * FROM movies";

    const allMovies: QueryResult<iMovie> = await connection.query(queryString);

    return allMovies.rows;
  }

  export const getMoviesQuantity = async () => {
    const queryString = "SELECT COUNT(*) FROM movies";

    const moviesQuantity: QueryResult<Number> = await connection.query(queryString);

    return moviesQuantity.rows;
  }
}
