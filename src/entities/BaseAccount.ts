import { Field, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import "reflect-metadata";
import { v4 as uuid } from "uuid";
import { Role } from "./Role";
import { UserRole } from "../constansts/UserRole";
import { MySqlDataSouce } from "../../ormconfig";

@ObjectType()
export class BaseAccount {
  @PrimaryColumn()
  @Field()
  _id: string = uuid();

  @Column({ unique: true })
  @Field()
  private _email: string;

  @Column()
  @Field()
  private _password: string;

  @Field()
  @CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP(6)" })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  private updatedAt!: Date;

  constructor(email: string, password: string) {
    this._email = email;
    this._password = password;
  }

  get id(): string {
    return this._id;
  }
  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }
  get password(): string {
    return this._password;
  }

  set password(value: string) {
    if (value.length < 6) {
      throw new Error("รหัสผ่านต้องมี 6 ตัวอักษรขึ้นไป");
    }
    this._password = value;
  }
}
