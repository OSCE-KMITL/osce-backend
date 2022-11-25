import { BaseAccount } from "./BaseAccount";
import { Field, ObjectType } from "type-graphql";
import { Column, Entity } from "typeorm";

@Entity()
@ObjectType()
export class AdvisorAccount extends BaseAccount {
  @Column({ charset: "utf8mb4", collation: "utf8mb4_unicode_ci" })
  @Field()
  fullName: string;

  @Column({ charset: "utf8", collation: "utf8_general_ci" })
  @Field()
  faculty: string;

  constructor(
    email: string,
    password: string,
    fullName: string,
    faculty: string
  ) {
    super(email, password);
    super.isAdvisor = true;
    this.faculty = faculty;
    this.fullName = fullName;
  }
}
