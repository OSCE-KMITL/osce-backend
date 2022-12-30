import { Advisor } from '../../entity/Advisor';
import { Student } from '../../entity/Student';
import { registerEnumType } from 'type-graphql';
import { createUnionType } from 'type-graphql';
import { CompanyPerson } from '../../entity/CompanyPerson';

export type Roles = Advisor | Student | CompanyPerson;

export enum ERole {
    ADVISOR = 'ADVISOR',
    STUDENT = 'STUDENT',
    COMPANY = 'COMPANY',
}

registerEnumType(ERole, {
    name: 'Role', // this one is mandatory
    description: 'type of user', // this one is optional
});

export const URole = createUnionType({
    name: 'RoleOfUser', // the name of the GraphQL union
    types: () => [Student, Advisor, CompanyPerson] as const, // function that returns tuple of object types classes
});
