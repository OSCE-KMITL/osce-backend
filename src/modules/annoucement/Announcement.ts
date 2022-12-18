import { Field, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import "reflect-metadata";
import { v4 as uuid } from "uuid";

@Entity()
@ObjectType()
export class Announcement {
  @PrimaryColumn()
  @Field()
  private id: string = uuid();

  @Column({ type: "varchar" })
  @Field()
   title: string;

  @Column({ type: "text" })
  @Field()
   description: string;

  @Field()
  @CreateDateColumn({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP(6)",
    name: "created_at",
  })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
    name: "updated_at",
  })
  private updatedAt!: Date;

  constructor(title: string, desc: string) {
    this.title = title;
    this.description = desc;
  }


}
