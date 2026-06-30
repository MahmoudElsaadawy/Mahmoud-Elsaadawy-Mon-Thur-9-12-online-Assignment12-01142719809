import { bootstrap } from "./src/bootstrap.js";
import { resolve } from "path";
import express from "express";
import dotenv from "dotenv"

dotenv.config({
  path: resolve("./src/config/.env"),
  quiet: true
})

const PORT = process.env.PORT;
const app = express();

bootstrap(express, app);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
