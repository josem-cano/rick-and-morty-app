import { DataSource } from "typeorm";

export const mainDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATASOURCE_HOST,
  port: parseInt(process.env.DATASOURCE_PORT as string),
  username: process.env.DATASOURCE_USER,
  password: process.env.DATASOURCE_PASSWORD,
  database: process.env.DATASOURCE_NAME,
  entities: [`${__dirname}/../../entity/*.{j,t}s`],
  migrations: [`${__dirname}/../../migrations/*{.ts,.js}`],
  logging: false,
});
