import { BaseAccount } from "./BaseAccount";
import { Field, ObjectType } from "type-graphql";
import { Column, Entity } from "typeorm";

@Entity()
@ObjectType()
export class AdvisorAccount extends BaseAccount {
  @Column()
  @Field()
  _fullName: string;

  @Column()
  @Field()
  _faculty: string;

  constructor(
    email: string,
    password: string,
    fullName: string,
    faculty: string
  ) {
    super(email, password);
    this._faculty = faculty;
    this._fullName = fullName;
  }

  get email(): string {
    return super.email;
  }

  set email(value: string) {
    super.email = value;
  }

  get id(): string {
    return super.id;
  }

  get password(): string {
    return super.password;
  }

  set password(value: string) {
    super.password = value;
  }
  get fullName(): string {
    return this._fullName;
  }

  set fullName(value: string) {
    this._fullName = value;
  }

  get faculty(): string {
    return this._faculty;
  }

  set faculty(value: string) {
    this._faculty = value;
  }
}
