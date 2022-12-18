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
export class Announcement {
    @PrimaryColumn()
    @Field() private _id: string = uuid();

    @Column({type:"varchar"})
    @Field()
    private _title: string;

    @Column({type:"text"})
    @Field()
    private _description: string;

    @Column()
    @Field()
    private created_by:string

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

    constructor(title:string , desc:string) {
        if (title.length>255) throw new Error("หัวข้อต้องมีตัวอักษรไม่เกิน 255 ตัวอักษร")
        if (desc.length>1000) throw new Error("หัวข้อต้องมีตัวอักษรไม่เกิน 1000 ตัวอักษร")
        const cleaned_title = title.trim()
        const cleaned_desc = desc.trim()
        this._title = cleaned_title
        this._description = cleaned_desc
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }
}
