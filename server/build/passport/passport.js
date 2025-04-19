"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurePassport = void 0;
const passport_local_1 = require("passport-local");
const User_1 = require("../model/User");
const configurePassport = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.User.findById(id);
            done(null, user);
        }
        catch (error) {
            done(error, null);
        }
    }));
    passport.use('local', new passport_local_1.Strategy({
        usernameField: 'email'
    }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Hitelesítési kísérlet:', email);
        try {
            const user = yield User_1.User.findOne({ email });
            console.log('Felhasználó található:', !!user);
            if (!user)
                return done(null, false, { message: 'Hibás email vagy jelszó' });
            const isValid = yield user.comparePassword(password);
            console.log('Jelszó egyezik:', isValid);
            if (!isValid)
                return done(null, false, { message: 'Hibás email vagy jelszó' });
            return done(null, user);
        }
        catch (error) {
            console.error('Hitelesítési hiba:', error);
            return done(error);
        }
    })));
    return passport;
};
exports.configurePassport = configurePassport;
