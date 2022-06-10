import { DataSource } from "typeorm";
import { User } from "../models/user";
import { Game } from "../models/game";
import { Action } from "../models/action";
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Game, Action],
    synchronize: true,
    logging: false
});

export function initDB(){
    return new Promise((resolve, reject) => {
        AppDataSource.initialize()
        .then( () => {
            resolve(true);
        })
        .catch(error => {
            reject(error);
        });
    });
}