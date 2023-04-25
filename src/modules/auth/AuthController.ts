import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';
import { AccountRepository } from '../account/AccountRepository';
import { Account } from '../../entity/Account';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { TokenHandler } from '../../utils/TokenHandler';
import { AppContext } from '../../shared/types/context-types';
import { isAuthenticated } from '../../middleware/isAuthenticated';
import { useAuthorization } from '../../middleware/useAuthorization';
import { RoleOption } from '../../shared/types/Roles';

config();

@ObjectType()
export class AuthData extends Account {
    @Field()
    token: string;
}
@Resolver()
@Service()
export class AuthController {
    constructor(private readonly account_repository = new AccountRepository(Account)) {}
    @Mutation(() => AuthData, { nullable: true })
    async signIn(@Arg('email') email: string, @Arg('password') password: string,
                 @Ctx() { res }: AppContext): Promise<AuthData | null> {
        try {
            if (!email) throw new Error('Email is required.');
            if (!password) throw new Error('Password is required.');

            // ตรวจสอบว่ามี user ใน database หรือไม่ ?
            const user = await this.account_repository.findOne('email', email);
            if (!user) throw new Error('อีเมล หรือรหัสผ่านไม่ถูกต้อง');

            // ตรวจสอบว่า password ถูกต้องหรือไม่ ?
            const valid_password = await bcrypt.compare(password, user.password);
            if (!valid_password) throw new Error('อีเมล หรือรหัสผ่านไม่ถูกต้อง');

            const token = TokenHandler.createToken(user.id, user.token_version);

            return { ...user, token } as AuthData;
        } catch (e) {
            throw e;
        }
    }

    @Query(() => Account, { nullable: true })
    async getMe(@Ctx() { req }: AppContext): Promise<Account | null> {
        try {
            if (!req.user_id){
                return null
            }
            const me = await this.account_repository.findOne('id', req.user_id!);
            return me;
        } catch (e) {
            console.log(e)
            throw e;
        }
    }
}
