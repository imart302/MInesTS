import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Action } from "./action";

@Entity("games")
export class Game {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', {length: 2000})
    gridcurrent: string;

    @Column({default: 'ACTIVE'})
    status: string

    @ManyToOne(() => User, (user) => user.games)
    user: User

    @OneToMany(() => Action, (action) => action.game)
    actions: Action[]
}
