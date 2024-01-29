import { Router } from "express";
import { jwtValidation } from "../middleware/auth";
import { authRouter } from "./auth";
import { charactersRouter } from "./characters";

export const buildRouter = (): Router => {
  const mainRouter = Router();

  mainRouter.use("/auth", authRouter);
  mainRouter.use("/characters", jwtValidation, charactersRouter);

  return mainRouter;
};
