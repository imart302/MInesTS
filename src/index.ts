import Server from "./models/server";
import "reflect-metadata";
import * as dotenv from 'dotenv';
import {initDB} from './config/db';

dotenv.config();

initDB()
.then((val) => {
    const server = new Server();
    server.listen();
})
.catch((error) => {
    console.log(error);
})



