import { ApolloServer } from 'apollo-server';
import 'reflect-metadata';
import { MySqlDataSource } from '../ormconfig';
import { GraphqlUtil } from './utils/graphql/GraphqlUtil';

const PORT = 4000;

export const bootstrap = async () => {
    await MySqlDataSource.initialize()
        .then(() => console.log('Data Source has been initialized!'))
        .catch((err) => console.log(err));
    const schema = await GraphqlUtil.getSchema();
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
