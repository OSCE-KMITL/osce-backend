import { MiddlewareFn } from 'type-graphql';
import { AppContext } from '../shared/types/context-types';
import { AccountRepository } from '../modules/account/AccountRepository';
import { Account } from '../entity/Account';
import { RoleOption } from '../shared/types/Roles';

export function useAuthorization(roles: RoleOption[]): MiddlewareFn<AppContext> {
    return async ({ context }, next) => {
        const account_repo = new AccountRepository(Account);

        const req_user_id = context.req.user_id;

        const user = await account_repo.findOne('id', req_user_id!);

        if (!user) throw new Error('กรุณาเข้าสู่ระบบ');

        // ตรวจสอบว่า role ของ user ตรงกับที่มีอยู่ใร roles[] หรือไม่ ?
        const isAuthorized = roles.includes(user.role);

        if (!isAuthorized) throw new Error('Not Authorized');

        return await next();
    };
}
