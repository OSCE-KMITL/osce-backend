import { v4 as uuid } from "uuid";
import { UserRole } from "../constansts/UserRole";
import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
} from "typeorm";
import { BaseAccount } from "./BaseAccount";

@Entity()
@ObjectType()
export class Role extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id: string = uuid();

  @Column()
  @Field(() => UserRole)
  role: UserRole;
}
