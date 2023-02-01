import { middlewares } from "./callbacks/middlewares";
import { requests } from "./callbacks/requests";

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

api.listen(3000, () => console.log("API is running :))"));
