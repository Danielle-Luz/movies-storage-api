const express = require("express");
const api = express();

api.use(express.json());

api.listen(3000, () => console.log("API is running :))"));