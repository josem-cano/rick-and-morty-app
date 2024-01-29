import "reflect-metadata";
import { TestHelper } from "../../utils/test-helper";
import datasource from "../../config/datasources/datasource";
import {
  getCharactersWithFav,
  getSingleCharacterWithFav,
  upsertFavCharacter,
} from "../../services/rick-morty-service";
import { FavCharacter } from "../../entity";
import { RickAndMortyApiError } from "../../utils";

describe("Auth Service", () => {
  beforeAll(async () => {
    TestHelper.setupTestDB();

    await datasource.initialize();
  });

  afterAll(async () => {
    TestHelper.teardownTestDB();
    await datasource.destroy();
  });

  it("Can get characters from api", async () => {
    const user = await TestHelper.getOrCreateUser();
    const { characters } = await getCharactersWithFav(user, 0);
    expect(characters.length).toBe(20);
  });

  it("Can get single character from api", async () => {
    const user = await TestHelper.getOrCreateUser();
    const character = await getSingleCharacterWithFav(1, user);
    expect(character).toBeDefined();
    expect(character.id).toBe(1);
  });

  it("Characters have 'favourite' property", async () => {
    const user = await TestHelper.getOrCreateUser();

    const { characters } = await getCharactersWithFav(user, 0);
    expect(characters[0].favourite).toBe(false);
  });

  it("Can fav a character", async () => {
    const user = await TestHelper.getOrCreateUser();

    const character = await upsertFavCharacter(1, true, user);
    expect(character.favourite).toBe(true);
  });

  it("Can unfav a character", async () => {
    const user = await TestHelper.getOrCreateUser();

    const character = await upsertFavCharacter(1, false, user);
    expect(character.favourite).toBe(false);
  });

  it("Can not fav a not existing character", async () => {
    const user = await TestHelper.getOrCreateUser();

    await expect(upsertFavCharacter(112313, false, user)).rejects.toThrow(
      RickAndMortyApiError,
    );
  });

  it("Properly finds previously 'favourited' characters", async () => {
    const user = await TestHelper.getOrCreateUser();

    const repo = datasource.getRepository(FavCharacter);

    const favCharacter = repo.create({ characterId: 1, userId: user.id });
    await repo.save(favCharacter);
    const character = await getSingleCharacterWithFav(1, user);
    expect(character.favourite).toBe(true);
  });

  it("Throws error if no character found by id", async () => {
    const user = await TestHelper.getOrCreateUser();
    await expect(getSingleCharacterWithFav(120102, user)).rejects.toThrow(
      RickAndMortyApiError,
    );
  });
});
