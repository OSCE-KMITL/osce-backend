import { ApolloServer } from 'apollo-server-express';
import { GraphqlUtil } from './GraphqlUtil';

export class ServerConfig {
    static async createServer() {
        const schema = await GraphqlUtil.getSchema();
        return new ApolloServer({
            schema,
        });
    }
}
