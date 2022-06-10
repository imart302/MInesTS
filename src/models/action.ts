import { DateDataType } from "sequelize/types";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./game";

@Entity("actions")
export class Action {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    x: number

    @Column()
    y: number

    @Column({type:'datetime', default: () => "now()"})
    date: Date

    @ManyToOne(() => Game, (game) => game.actions)
    game: Game
}