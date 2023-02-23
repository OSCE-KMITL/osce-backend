import { registerEnumType } from 'type-graphql';

export enum CoopStatus {
    DEFAULT = 'DEFAULT',
    APPLYING = 'APPLYING',
    PASSED = 'PASSED',
    REJECTED = 'REJECTED',
}

registerEnumType(CoopStatus, {
    name: 'CoopStatus', // this one is mandatory
    description: 'status of coop applying', // this one is optional
});
