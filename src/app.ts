import { middlewares } from "./callbacks/middlewares";
import { requests } from "./callbacks/requests";
import { database } from "./database";

const express = require("express");
const api = express();

api.use(express.json());

api.post(
  "/movies",
  middlewares.checkMovieKeys,
  middlewares.checkIfNameAlreadyExists,
  middlewares.checkMoviePropertiesTypes,
  requests.createMovie
);

api.get("/movies", middlewares.checkQueryParams, requests.getMoviesByPage);

api.listen(3000, async () => {
  await database.openConnection();

  console.log("API is running :))");
});
