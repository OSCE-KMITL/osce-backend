import { Request, Response } from 'express';

export interface AppRequest extends Request {
    user_id?: string;
    token_version?: number;
}
export interface AppContext {
    res: Response;
    req: AppRequest;
}
