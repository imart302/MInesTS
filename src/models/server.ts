import express from 'express';
import cors from 'cors';
import userRoute from '../routes/user';
import authRoute from '../routes/auth';
import gameRoute from '../routes/game';
import passport from 'passport';

import PassportInit from '../config/auth';


class Server {
    
    app: express.Application

    constructor(){
        //initialize the express app
        this.app = express();

        //set up first app middleware
        this.middleware();

        //set up app routes
        this.routes();
    }

    middleware(){
        PassportInit(passport);
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(passport.initialize());
    }

    routes(){
        this.app.use('/user', userRoute);
        this.app.use('/auth', authRoute);
        this.app.use('/game', gameRoute);
    }

    listen (){
        this.app.listen(process.env.PORT || 5000, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    }
}

export default Server;