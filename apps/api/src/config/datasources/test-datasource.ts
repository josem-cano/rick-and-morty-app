import { DataSource } from "typeorm";

export const testDatasource = new DataSource({
  type: "better-sqlite3",
  database: ":memory:",
  entities: [`${__dirname}/../../entity/*.{j,t}s`],
  synchronize: true,
  logging: false,
});
