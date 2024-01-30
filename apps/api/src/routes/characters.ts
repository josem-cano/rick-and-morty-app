import { Router } from "express";
import { z, ZodError } from "zod";
import {
  getCharactersWithFav,
  getSingleCharacterWithFav,
  upsertFavCharacter,
} from "../services/rick-morty-service";
import { User } from "../entity";
import { formatZodError, RickAndMortyApiError } from "../utils";

export const charactersRouter = Router();
const GetCharactersSchema = z.object({
  query: z.object({
    page: z.coerce.number({
      required_error: "Must pass a page",
    }),
    name: z.optional(z.string()),
    type: z.optional(z.string()),
    species: z.optional(z.string()),
    status: z.optional(z.enum(["alive", "dead", "unknown"])),
    gender: z.optional(z.enum(["female", "male", "genderless", "unknown"])),
  }),
});
charactersRouter.get("/", async (req, res) => {
  const user = req.user as User;
  try {
    const { query } = await GetCharactersSchema.parseAsync(req);
    const page = await getCharactersWithFav(user, { ...query });
    return res.status(200).json(page);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(formatZodError(error));
    } else if (error instanceof RickAndMortyApiError) {
      return res.status(error.status).send(error.message);
    }
    return res.status(500).json({ message: error });
  }
});

const GetCharacterSchema = z.object({
  params: z.object({
    id: z.coerce.number({
      required_error: "Must pass a character id",
    }),
  }),
});

charactersRouter.get("/:id", async (req, res) => {
  const user = req.user as User;
  try {
    const { params } = await GetCharacterSchema.parseAsync(req);

    try {
      const character = await getSingleCharacterWithFav(params.id, user);
      return res.status(200).json(character);
    } catch (e) {
      if (e instanceof RickAndMortyApiError) {
        return res.status(e.status).send(e.message);
      }
      return res.status(500).json(e);
    }
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json(formatZodError(error));
    } else {
      console.log(error);
      res.status(500).json({ message: error });
    }
  }
});

const FavCharacterSchema = z.object({
  params: z.object({
    id: z.coerce.number({
      required_error: "Must pass a character id",
    }),
  }),
  body: z.object({
    fav: z.boolean(),
  }),
});

charactersRouter.patch("/:id", async (req, res) => {
  const user = req.user as User;
  try {
    const { params, body } = await FavCharacterSchema.parseAsync(req);

    const favCharacter = await upsertFavCharacter(params.id, body.fav, user);

    return res.status(200).json(favCharacter);
  } catch (error) {
    if (error instanceof ZodError)
      return res.status(400).json(formatZodError(error));
    if (error instanceof RickAndMortyApiError)
      return res.status(error.status).send(error.message);
    console.log(error);
    return res.status(500).json({ message: error });
  }
});
