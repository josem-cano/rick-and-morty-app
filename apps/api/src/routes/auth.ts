import { Request, Router } from "express";
import { compareSync, hash } from "bcrypt";
import { z, ZodError } from "zod";
import { User } from "../entity";
import { generateJwt } from "../services/auth-service";
import { formatZodError } from "../utils";
import datasource from "../config/datasources/datasource";

export const authRouter = Router();

const RegisterSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    }),
    email: z.string({ required_error: "Email is required" }).email(),
    password: z.string().min(8),
  }),
});

const LoginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email(),
    password: z.string().min(8),
  }),
});

authRouter.post("/register", async (req: Request, res) => {
  try {
    const { body } = await RegisterSchema.parseAsync(req);

    const usersRepository = datasource.getRepository(User);

    const foundUser = await usersRepository.findOneBy({ email: body.email });

    if (foundUser) {
      return res.status(409).json({ message: "User already registered" });
    }
    const encrypted = await hash(body.password, 10);
    const user = usersRepository.create({ ...body, password: encrypted });
    await usersRepository.save(user);
    return res.status(201).json({
      user,
      token: generateJwt(user),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(formatZodError(error));
    } else {
      console.log(error);
      res.status(500).json({ message: error });
    }
  }
});

authRouter.post("/login", async (req: Request, res) => {
  try {
    const { body } = await LoginSchema.parseAsync(req);
    const usersRepository = datasource.getRepository(User);
    const foundUser = await usersRepository.findOneBy({ email: body.email });
    if (!foundUser) {
      return res.status(409).json({ message: "Email is not registered" });
    }
    if (!compareSync(body.password, foundUser.password)) {
      return res.status(409).json({ message: "Passwords do not match" });
    }
    return res.status(200).json({
      user: foundUser,
      token: generateJwt(foundUser),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(formatZodError(error));
    } else {
      console.log(error);
      res.status(500).json({ message: error });
    }
  }
});
