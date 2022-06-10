"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const passport_jwt_2 = require("passport-jwt");
const user_1 = require("../models/user");
const db_1 = require("./db");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
function init(passport) {
    passport.serializeUser((req, user, done) => {
        done(undefined, user);
    });
    passport.deserializeUser((id, done) => {
        db_1.AppDataSource.manager.getRepository(user_1.User).findOneBy({ id })
            .then((user) => {
            done(null, user);
        })
            .catch(error => {
            done(error, null);
        });
    });
    passport.use(new passport_jwt_2.Strategy({
        secretOrKey: process.env.JWTSECRET || "jwttest1234",
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()
    }, (payload, done) => {
        const { id } = payload;
        db_1.AppDataSource.manager.getRepository(user_1.User).findOneBy({ id })
            .then(user => {
            if (!user) {
                return done(null, false, { message: "User not found" });
            }
            else {
                return done(null, user, { message: "Done" });
            }
        });
    }));
    passport.use('login', new passport_local_1.Strategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => {
        console.log(email);
        db_1.AppDataSource.manager.getRepository(user_1.User).findOneBy({ email })
            .then(user => {
            if (user && user.deleted == false) {
                console.log(user);
                if (user.password === password) {
                    console.log("Valid password");
                    return done(null, user, { message: 'User authorized' });
                }
                else {
                    return done(null, null, { message: 'Incorrect password' });
                }
            }
            else {
                console.log("User not found");
                return done(null, null, { message: 'User not registered' });
            }
        });
    }));
}
exports.default = init;
//# sourceMappingURL=auth.js.map