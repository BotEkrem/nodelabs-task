import {Strategy as LocalStrategy} from "passport-local";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";

import {validationCheck} from "@/misc/functions/validation";
import {ErrorObject} from "@/misc/interfaces/errorObject";
import {LoginDto} from "@/dto/auth/login.dto";
import {RegisterDto} from "@/dto/auth/register.dto";

import {User} from "@/models/User";

export default function (passport) {
    passport.use(
        "login",
        new LocalStrategy(
            {
                usernameField: "username",
                passwordField: "password",
                passReqToCallback: true
            },
            async (req, takenUsername, takenPassword, done) => {
                try {
                    const loginData = new LoginDto()
                    loginData.username = takenUsername
                    loginData.password = takenPassword

                    const dataCheck = await validationCheck<LoginDto>(loginData) as LoginDto

                    if (!dataCheck.username) {
                        return done((dataCheck as unknown as ErrorObject).errors, false);
                    }

                    const user = await User.findOne({username: takenUsername});
                    if (!user) return done(null, false);

                    const isMatch = await argon2.verify(user.password, takenPassword);
                    if (!isMatch) return done(null, false);

                    user.loginAt = new Date()
                    user.loginIP = req.ip
                    await user.save()

                    return done(null, jwt.sign({
                        id: user.id,
                        username: user.username
                    }, process.env.JWT_SECRET as string, {expiresIn: "1h"}));
                } catch (error) {
                    return done(error, false);
                }
            }
        )
    );
    passport.use(
        "register",
        new LocalStrategy(
            {
                usernameField: "username",
                passwordField: "password",
                passReqToCallback: true
            },
            async (req, takenUsername, takenPassword, done) => {
                try {
                    const registerData = new RegisterDto()
                    registerData.username = takenUsername
                    registerData.password = takenPassword
                    registerData.confirmPassword = req.body.confirmPassword

                    const dataCheck = await validationCheck<RegisterDto>(registerData) as RegisterDto


                    if (!dataCheck.username) {
                        return done((dataCheck as unknown as ErrorObject).errors, false);
                    }

                    const user = await User.findOne({username: registerData.username});

                    if (user?.username) {
                        return done({errors: ["This username was already used by someone."]}, false)
                    }

                    const newUser = new User({
                        username: takenUsername,
                        password: takenPassword,
                    });

                    await newUser.save();

                    return done(null, {success: true});
                } catch (error) {
                    return done(error, false);
                }
            }
        )
    );
};