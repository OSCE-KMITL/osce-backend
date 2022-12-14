import 'reflect-metadata';
import { MySqlDataSource } from '../ormconfig';
import Express from 'express';
import { config } from 'dotenv';
import { ServerConfig } from './config/ServerConfig';
import cookieParser from 'cookie-parser';
import { PORT, FRONTEND_URI } from './shared/constants';
config();

export const bootstrap = async () => {
    const app = Express();
    app.use(cookieParser());
    await MySqlDataSource.initialize()
        .then(() => console.log('Data Source has been initialized!'))
        .catch((err) => console.log(err));

    const server = await ServerConfig.createServer();

    await server.start();

    await server.applyMiddleware({ app, cors: { origin: ['https://studio.apollographql.com', FRONTEND_URI!], credentials: true } });

    app.listen(PORT || 4000, () => {
        console.log(`🚀  Server ready at: http://localhost:${PORT || 4000}${server.graphqlPath || '/graphql'}`);
    });
};

try {
    bootstrap().then();
} catch (e) {
    console.log(e);
}
