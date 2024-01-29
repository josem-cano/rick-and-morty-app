import { Character, CharactersPage } from "@repo/domain";
import { Character as ApiCharacter } from "rickmortyapi/dist/interfaces";
import { In } from "typeorm";
import { getCharacter, getCharacters } from "rickmortyapi";
import { FavCharacter } from "../entity/fav-character";
import { User } from "../entity/user";
import { RickAndMortyApiError } from "../utils";
import datasource from "../config/datasources/datasource";

export const getCharactersWithFav = async (
  user: User,
  page: number,
): Promise<CharactersPage> => {
  const response = await getCharacters({ page });
  if (response.status !== 200) {
    throw new RickAndMortyApiError(response.status, response.statusMessage);
  }
  const apiCharacters = response.data.results as ApiCharacter[];
  const favCharactersRepo = datasource.getRepository(FavCharacter);
  const favCharacters = await favCharactersRepo.findBy({
    userId: user.id,
    characterId: In(apiCharacters.map((apic) => apic.id)),
  });
  const favsGroup = favCharacters.reduce<Record<string, FavCharacter>>(
    (acc, f) => {
      acc[f.characterId] = f;
      return acc;
    },
    {},
  );

  return {
    totalPages: response.data.info?.pages as number,
    characters: apiCharacters.map<Character>((c) => ({
      ...c,
      favourite: Boolean(favsGroup[c.id]),
    })),
  };
};

export const getSingleCharacterWithFav = async (
  id: number,
  user: User,
): Promise<Character> => {
  const response = await getCharacter(id);
  if (response.status !== 200) {
    throw new RickAndMortyApiError(response.status, response.statusMessage);
  }

  const apiCharacter = response.data;
  const favCharactersRepo = datasource.getRepository(FavCharacter);
  const favCharacter = await favCharactersRepo.findOneBy({
    userId: user.id,
    characterId: id,
  });

  return { ...apiCharacter, favourite: Boolean(favCharacter) };
};

export const upsertFavCharacter = async (
  id: number,
  fav: boolean,
  user: User,
): Promise<Character> => {
  const favCharactersRepo = datasource.getRepository(FavCharacter);
  const currentFav = await favCharactersRepo.findOneBy({
    userId: user.id,
    characterId: id,
  });
  const response = await getCharacter(id);
  if (response.status !== 200) {
    throw new RickAndMortyApiError(response.status, response.statusMessage);
  }

  if (!fav && currentFav) {
    await favCharactersRepo.remove(currentFav);
  } else if (fav && !currentFav) {
    const favCharacter = favCharactersRepo.create({
      characterId: id,
      userId: user.id,
    });
    await favCharactersRepo.save(favCharacter);
  }

  return { ...response.data, favourite: fav };
};
