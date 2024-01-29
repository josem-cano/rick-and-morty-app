import { DataSource } from "typeorm";
import { FavCharacter, User } from "../../entity";

export const testDataSource = new DataSource({
  type: "better-sqlite3",
  database: ":memory:",
  entities: [`${__dirname}/../../entity/*.{j,t}s`],
  synchronize: true,
  logging: false,
});
