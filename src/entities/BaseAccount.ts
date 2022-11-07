import { Field, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import "reflect-metadata";
import { v4 as uuid } from "uuid";


@ObjectType()
export class BaseAccount {
  @PrimaryColumn()
  @Field()
  id: string = uuid();

  @Column({ unique: true })
  @Field()
  private email: string;

  @Column()
  @Field()
  private password: string;

  @Column({default:false})
  @Field()
  isComittee:Boolean = false

  @Column({default:false})
  @Field()
  isStudent:Boolean = false

  @Column({default:false})
  @Field()
  isCompany:Boolean = false

  @Column({default:false})
  @Field()
  isAdvisor:Boolean =false

  @Column()
  @Field()
  status: string = "active"

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
    this.email = email;
    this.password = password;
  }
}
