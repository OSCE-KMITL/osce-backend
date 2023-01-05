import { MiddlewareFn } from 'type-graphql';
import { AppContext } from '../shared/types/context-types';
import { AccountRepository } from '../modules/account/AccountRepository';
import { Account } from '../entity/Account';

export const isAuthenticated: MiddlewareFn<AppContext> = async ({ context }, next) => {
    const account_repo = new AccountRepository(Account);

    const req_user_id = context.req.user_id;
    const req_token_version = context.req.token_version;

    // ตรวจาอบว่ามี token หรือเปล่า ?
    if (!req_user_id) throw new Error('กรุณาเข้าสู่ระบบ');

    const logged_in_user = await account_repo.findOne('id', req_user_id);
    // ตรวจสอบว่า token version ตรงกันหรือเปล่า ?
    if (logged_in_user?.token_version !== req_token_version) throw new Error('กรุณาเข้าสู่ระบบ');
    return next();
};
