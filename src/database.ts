import { Client, QueryResult } from "pg";
import format from "pg-format";
import { iMovie } from "./interfaces";

export namespace database {
  const connection = new Client({
    user: "postgres",
    password: "12345",
    host: "localhost",
    database: "postgres",
    port: 5432,
  });

  const openConnection = async () => {
    await connection.connect();

    console.log("Connection opened");
  };

  const closeConnection = async () => {
    await connection.end();

    console.log("Connection was closed");
  };

  export const getMovieByName = async (searchedName: string) => {
    const queryString = format(
      "SELECT * FROM movies WHERE name = %L",
      searchedName
    );

    try {
      await openConnection();

      const resultQuery: QueryResult<iMovie> = await connection.query(
        queryString
      );
      const movieFound: iMovie[] = resultQuery.rows;

      await closeConnection();

      return movieFound;
    } catch (error) {
      console.error(error);
    }
  };
}
