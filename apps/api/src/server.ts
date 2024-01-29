import "reflect-metadata";
import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import { buildRouter } from "./routes";
import datasource from "./config/datasources/datasource";
import { User } from "./entity";

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}
export const createServer = (): Express => {
  if (!datasource.isInitialized) {
    datasource
      .initialize()
      .then(() => {
        console.log("Main DataSource has been initialized!");
      })
      .catch((err) => {
        console.log("Error during DataSource initialization:", err);
      });
  }
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .use(buildRouter());
  return app;
};
