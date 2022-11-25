import { DataSource } from "typeorm";
import "reflect-metadata";
import * as dotenv from "dotenv"

if (process.env.NODE_ENV !== "development"){
  dotenv.config({
    path:".env.test",
    override:true
  })
}
export const MySqlDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "devteam",
  password: "123456",
  database: process.env.NODE_ENV==="development" ? "osce":"osce",
  dropSchema:false,
  synchronize: true,
  logging: false,
  entities: ["src/entities/*.{ts,js}"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  charset: "UTF8_GENERAL_CI",
});

