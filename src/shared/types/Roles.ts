import { registerEnumType } from 'type-graphql';

export enum RoleOption {
    ADVISOR = 'ADVISOR',
    STUDENT = 'STUDENT',
    COMPANY = 'COMPANY',
    COMMITTEE = 'COMMITTEE',
    SUPER_ADMIN = 'SUPER_ADMIN',
}

registerEnumType(RoleOption, {
    name: 'Role', // this one is mandatory
    description: 'type of user', // this one is optional
});

export enum AccountStatus {
    ACTIVE = 'ACTIVE',
    BAN = 'BAN',
    INACTIVE = 'INACTIVE',
}
