import { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt } from "passport-jwt";
import { Strategy as JWTStrategy } from "passport-jwt";
import { User } from "../models/user";
import { AppDataSource } from "./db";
import * as dotenv from 'dotenv';
dotenv.config();

function init(passport: PassportStatic){
    passport.serializeUser<any, any>((req, user, done) => {
        done(undefined, user);
    });

    passport.deserializeUser((id: number, done) => {
        AppDataSource.manager.getRepository(User).findOneBy({id})
        .then((user) => {
            done(null, user);
        })
        .catch(error => {
            done(error, null);
        })
    })

    passport.use(new JWTStrategy({
        secretOrKey: process.env.JWTSECRET || "jwttest1234",
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    (payload, done) => {
        const { id } = payload;
        AppDataSource.manager.getRepository(User).findOneBy({id})
        .then(user => {
            if(!user){
                return done(null, false, {message: "User not found"});
            }
            else{
                return done(null, user, {message: "Done"});
            }
        });
    }
    ));

    passport.use('login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    (email, password, done) => {
        console.log(email);
        AppDataSource.manager.getRepository(User).findOneBy({email})
        .then(user => {
            if(user && user.deleted == false){
                console.log(user);
                if(user.password === password){
                    console.log("Valid password");
                    return done(null, user, {message: 'User authorized'});
                }
                else{
                    return done(null, null, {message: 'Incorrect password'});
                }
            }
            else{
                console.log("User not found");
                return done (null, null, {message: 'User not registered'});
            }
        })
    }));
}

export default init;