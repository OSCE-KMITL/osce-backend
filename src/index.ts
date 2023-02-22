import 'reflect-metadata';
import {MySqlDataSource} from '../ormconfig';
import Express from 'express';
import {config} from 'dotenv';
import {ServerConfig} from './config/ServerConfig';
import cookieParser from 'cookie-parser';
import { PORT, FRONTEND_URI } from './shared/constants';
const { graphqlUploadExpress } = require('graphql-upload');
import {FRONTEND_URI, GOOGLE_CALLBACK_ROUTE, PORT} from './shared/constants';
import passport from 'passport';
import {AppRequest} from './shared/types/context-types';
import {PassportGoogle} from './modules/auth/passport';
import {TokenHandler} from './utils/TokenHandler';
import bcrypt from 'bcrypt';
import {AccountRepository} from './modules/account/AccountRepository';
import {Account} from './entity/Account';
import {RoleOption} from './shared/types/Roles';
import EmailExtractor from './utils/EmailExctractor';
import {Student} from './entity/Student';

config();
PassportGoogle();
export const bootstrap = async () => {
    const app = Express();
    app.use(cookieParser());
    app.use(graphqlUploadExpress({ maxFileSize: 20000000, maxFiles: 5 }));
    app.use(Express.static('public'))

    // login route
    app.get('/auth/google', passport.authenticate('verify-student', { scope: ['profile', 'email'], session: false }));
    app.get('/', async (req, res) => {
        res.send('hello');
    });

    // logout clear cache
    app.get('/logout', function (req, res, next) {
        res.json('5555');
    });

    // google auth callback
    app.get(
        GOOGLE_CALLBACK_ROUTE!,
        passport.authenticate('verify-student', {
            session: false,
            scope: ['profile', 'email'],
        }),
        async (req: AppRequest, res) => {
            if (!req.google_profile) {
                return res.redirect(FRONTEND_URI! + '/error?params=NotAuthenticated');
            }

            try {
            } catch (error) {}
            const { id, name, photos, emails, provider } = req.google_profile;

            try {
                const account_repository = new AccountRepository(Account);
                const existed_account = await account_repository.findOne('google_id', id);

                // format input data
                const fmt_email = emails![0].value.trim().toLocaleLowerCase();
                const fmt_name = name?.givenName.trim().toLocaleLowerCase();
                const fmt_last_name = name?.familyName.trim().toLocaleLowerCase();

                // encrypted oneway password
                const plaintext = Date.now() + id + provider;
                const oneway_password = await bcrypt.hash(plaintext, 10);

                if (!existed_account) {
                    const student_id = EmailExtractor.getStudentId(fmt_email);
                    const new_account = await new Account(fmt_email, oneway_password, RoleOption.STUDENT);
                    new_account.google_id = id;
                    new_account.profile_image = photos![0].value;
                    new_account.is_student = await new Student(student_id!, fmt_name!, fmt_last_name!);

                    const saved_account = await account_repository.save(new_account);
                    const token = TokenHandler.createToken(saved_account.id, saved_account.token_version);

                    await TokenHandler.sendTokenToCookie(res, token);
                    res.redirect(FRONTEND_URI! + '/coopregister');
                } else {
                    const token = TokenHandler.createToken(existed_account.id, existed_account.token_version);
                    await TokenHandler.sendTokenToCookie(res, token);
                    res.redirect(FRONTEND_URI! + '/coopregister');
                }
            } catch (error) {
                console.log(error);
            }
        }
    );

    await MySqlDataSource.initialize()
        .then(() => console.log('Data Source has been initialized!'))
        .catch((err) => console.log(err));

    const server = await ServerConfig.createServer();

    await server.start();

    await server.applyMiddleware({ app, cors: { origin: ['https://studio.apollographql.com', FRONTEND_URI!, 'http://localhost:3000/'], credentials: true } });

    app.listen(PORT || 4000, () => {
        console.log(`🚀  Server ready at: http://localhost:${PORT || 4000}${server.graphqlPath || '/graphql'}`);
    });
};

try {
    bootstrap().then();
} catch (e) {
    console.log(e);
}
