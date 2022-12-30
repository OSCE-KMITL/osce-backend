import { InputType } from 'type-graphql';
import { Account } from '../../../entity/Account';

@InputType()
class UpdateAccountInput extends Account {}