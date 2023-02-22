import { Request, Response } from 'express';
import { Profile } from 'passport-google-oauth20';

export interface AppRequest extends Request {
    user_id?: string;
    token_version?: number;
    google_profile?: Profile;
}
export interface AppContext {
    res: Response;
    req: AppRequest;
}
