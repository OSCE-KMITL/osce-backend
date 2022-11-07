import { DataSource } from "typeorm";
import 'reflect-metadata';
export const MySqlDataSouce = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "devteam",
  password: "123456",
  database: "osce",
  synchronize: true,
  logging: true,
  entities: ["src/entities/*.{ts,js}"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  charset: 'UTF8_GENERAL_CI'
});
