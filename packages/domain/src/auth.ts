import { User } from "./entities";

export type RegisterDTO = {
  name: string;
  email: string;
  password: string;
};

export type LoginDTO = {
  email: string;
  password: string;
};

export type UserSession = {
  user: User;
  token: string;
};
