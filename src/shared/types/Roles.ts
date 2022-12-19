import { Advisor } from '../../entity/Advisor';
import { Student } from '../../entity/Student';
import { registerEnumType } from 'type-graphql';
import { createUnionType } from 'type-graphql';

export type Roles = Advisor | Student;

export enum ERole {
    ADVISOR = 'ADVISOR',
    STUDENT = 'STUDENT',
}

registerEnumType(ERole, {
    name: 'Role', // this one is mandatory
    description: 'type of user', // this one is optional
});

export const URole = createUnionType({
    name: 'RoleOfUser', // the name of the GraphQL union
    types: () => [Student, Advisor] as const, // function that returns tuple of object types classes
});
