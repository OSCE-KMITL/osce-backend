import {DataSource} from "typeorm";

export const  MySqlDataSouce = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "devteam",
  password: "123456",
  database: "osce",
  synchronize: true,
  logging: false,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
})