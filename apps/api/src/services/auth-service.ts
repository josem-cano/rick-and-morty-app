import * as jsonwebtoken from "jsonwebtoken";
import { User } from "../entity";

const secret = process.env.JWT_SECRET as string;

export function generateJwt(user: User): string {
  return jsonwebtoken.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    secret,
  );
}

export function validateJwt(token: string): string | jsonwebtoken.JwtPayload {
  return jsonwebtoken.verify(token, secret);
}
