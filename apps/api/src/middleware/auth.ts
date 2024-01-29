import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { validateJwt } from "../services/auth-service";
import { User } from "../entity";
import datasource from "../config/datasources/datasource";

export const jwtValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.header("authorization");

  if (!header) return res.status(401).send("Authorization header missing");

  const token = header.split(" ")[1];

  if (!token) return res.status(401).send("Token is missing");

  try {
    const payload = validateJwt(token) as JwtPayload;
    datasource
      .getRepository(User)
      .findOneBy({ id: payload.id })
      .then((user) => {
        if (!user) {
          return res.status(401).send("User does not exist");
        }
        req.user = user;
        next();
      });
  } catch (e) {
    return res.status(401).send("Invalid token");
  }
};
