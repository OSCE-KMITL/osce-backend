import { ApolloServer } from 'apollo-server-express';
import { GraphqlUtil } from './GraphqlUtil';
import { AppContext } from '../shared/types/context-types';
import { TokenHandler } from '../utils/TokenHandler';

export class ServerConfig {
    static async createServer() {
        const schema = await GraphqlUtil.getSchema();
        return new ApolloServer({
            schema,
            context: ({ res, req }: AppContext) => {
                const token = req.headers.authorization;

                if (token) {
                    try {
                        // ดึง info ที่ได้รัยมาจาก headers
                        const auth_info = TokenHandler.getUserFromToken(token!) as {
                            user_id: string;
                            token_version: number;
                            iat: number;
                            exp: number;
                        } | null;
                        // ถ้ามี info (user logged-in แล้ว) set user_id , token_version ให้ resolver , controller ไปใช้ง่าย
                        if (auth_info) {
                            req.user_id = auth_info.user_id;
                            req.token_version = auth_info.token_version;
                        }
                    } catch (e) {
                        req.user_id = undefined;
                        req.token_version = undefined;
                    }
                }
                return { res, req };
            },
        });
    }
}
