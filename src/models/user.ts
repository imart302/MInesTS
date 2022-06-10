import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./game";

@Entity("users")
export class User{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    email?: string;

    @Column()
    password?: string

    @Column('boolean', {default: false})
    deleted?: boolean

    @OneToMany(() => Game, (game) => game.user)
    games?: Game[]

}