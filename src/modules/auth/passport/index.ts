import passport from 'passport';
import { Strategy as GoogleStrategy, StrategyOptionsWithRequest } from 'passport-google-oauth20';
import {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_ROUTE,
    BACKEND_URI,
    PORT,
    GOOGLE_LOGIN_CALLBACK_ROUTE,
} from '../../../shared/constants';
import { AppRequest } from '../../../shared/types/context-types';

const GoogleConfig: StrategyOptionsWithRequest = {
    clientID: GOOGLE_CLIENT_ID!,
    clientSecret: GOOGLE_CLIENT_SECRET!,
    callbackURL: GOOGLE_CALLBACK_ROUTE!,
    passReqToCallback: true,
    scope: ['email', 'profile'],
};

const LoginWithGoogleConfig: StrategyOptionsWithRequest = {
    clientID: GOOGLE_CLIENT_ID!,
    clientSecret: GOOGLE_CLIENT_SECRET!,
    callbackURL: GOOGLE_LOGIN_CALLBACK_ROUTE!,
    passReqToCallback: true,
    scope: ['email', 'profile'],
};

export const PassportGoogle = () => {
    passport.use(
        'verify-student',
        new GoogleStrategy(GoogleConfig, (req: AppRequest, accessToken, refreshToken, profile, done) => {
            req.google_profile = profile;
            done(undefined, profile);
        }),
    );
    passport.use(
        'login-with-google',
        new GoogleStrategy(LoginWithGoogleConfig, (req: AppRequest, accessToken, refreshToken, profile, done) => {
            req.google_profile = profile;
            done(undefined, profile);
        }),
    );
};

