import jwt from 'jsonwebtoken';
import { Response } from 'express';

export class TokenHandler {
    static createToken(user_id: string, token_version: number): string {
        return jwt.sign({ user_id, token_version }, process.env['TOKEN_SECRET']!, { expiresIn: process.env['TOKEN_EXPIRES_IN']! });
    }
    static sendTokenToCookie(res: Response, token: string) {
        try {
            res.cookie('Authentication', token, { httpOnly: true, sameSite: true, secure: true, maxAge: 1000 * 60 * 60 * 24 * 365 });
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    static getUserFromToken(token: string) {
        const fmt_token = token.split(' ');
        return jwt.verify(fmt_token[1], process.env['TOKEN_SECRET']!);
    }
}
