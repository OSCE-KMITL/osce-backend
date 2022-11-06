import { ApolloServer } from "apollo-server";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { AdvisorAccountController } from "./controller/advisor/AdvisorAccountController";
import { MySqlDataSouce } from "../ormconfig";

const PORT = 4000;

const bootstrap = async () => {
  await MySqlDataSouce.initialize()
    .then(() => console.log("Data Source has been initialized!"))
    .catch((err) => console.log(err));

  const schema = await buildSchema({
    resolvers: [AdvisorAccountController],
    emitSchemaFile: true,
  });

  const server = new ApolloServer({
    schema,
  });

  await server.listen(PORT);

  console.log(`🚀  Server ready at: http://localhost:${PORT}/`);
};

try {
  bootstrap().then();
} catch (e) {
  console.log(e);
}
