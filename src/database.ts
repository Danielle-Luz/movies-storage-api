import { throws } from "assert";
import { Client, QueryResult } from "pg";
import { format } from "node-pg-format";
import { iCount, iMovie, tCreateMovie, tUpdateMovie } from "./interfaces";

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
  };

  export const getMoviesWithFilters = async (
    perPage: number,
    page: number,
    order: string,
    sort: string
  ) => {
    const queryString = `
    SELECT * FROM movies
    ORDER BY %I %s
    LIMIT %L
    OFFSET %L
    `;
    const offset = perPage * page - 1;
    const moviesFound: QueryResult<iMovie> = await connection.query(
      format(queryString, sort, order, perPage, offset)
    );

    return moviesFound.rows;
  };

  export const getMoviesQuantity = async () => {
    const queryString = "SELECT COUNT(*) FROM movies";

    const moviesQuantity: QueryResult<iCount> = await connection.query(
      queryString
    );

    return moviesQuantity.rows[0].count;
  };

  export const getMovieById = async (movieId: number) => {
    const queryString = "SELECT * FROM movies WHERE id = %L";

    const foundMovie = await (
      await connection.query(format(queryString, movieId))
    ).rows[0];

    return foundMovie;
  };

  export const updateMovie = async (
    updatedMovieData: Partial<tCreateMovie>,
    updatedMovieId: number
  ) => {
    const updatedColumns = Object.keys(updatedMovieData);
    const updatedValues = Object.values(updatedMovieData);

    const queryString = `
    UPDATE movies
    SET(%I) = ROW(%L)
    WHERE id = %L
    RETURNING *
    `;

    const queryResult: QueryResult<tUpdateMovie> = await connection.query(
      format(queryString, updatedColumns, updatedValues, updatedMovieId)
    );

    return queryResult.rows[0];
  };

  export const deleteMovie = async (deletedMovieId: number) => {
    const queryString = "DELETE FROM movies WHERE id = %L";

    await connection.query(format(queryString, deletedMovieId));
  };
}
