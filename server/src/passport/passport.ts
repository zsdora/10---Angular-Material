import { PassportStatic } from 'passport';
import { Strategy } from 'passport-local';
import { User } from '../model/User';

export const configurePassport = (passport: PassportStatic): PassportStatic => {
    passport.serializeUser((user: any, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });

    passport.use('local', new Strategy({
        usernameField: 'email'
    }, async (email, password, done) => {
        console.log('Hitelesítési kísérlet:', email);
        try {
            const user = await User.findOne({ email });
            console.log('Felhasználó található:', !!user);
            
            if (!user) return done(null, false, { message: 'Hibás email vagy jelszó' });
            
            const isValid = await user.comparePassword(password);
            console.log('Jelszó egyezik:', isValid);
            
            if (!isValid) return done(null, false, { message: 'Hibás email vagy jelszó' });
            
            return done(null, user);
        } catch (error) {
            console.error('Hitelesítési hiba:', error);
            return done(error);
        }
    }));

    return passport;
};
