import passport from 'passport';
import passportLocal from 'passport-local';
import { throwError } from '../helpers/ErrorHandler.helper';
import { DeserializeUser, deserializeUserSchema } from '../schemas/user.schema';
import { findUserById, findUserByUsername } from '../services/user.service';
import { verifyPassword } from '../utils/password';

const LocalStrategy = passportLocal.Strategy;

const strategy = new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await findUserByUsername(username);
            if (!user) {
                done(null, false);
                return;
            }
            const result = await verifyPassword(user.password, password)
            if (!result) done(null, false);
            done(null, user);
        } catch (error) {
            console.error(error);
            throwError(400, `Error in validating user`);
        }
    }
);

passport.use(strategy);
// ============================================================
// passport serialize and deserialize
// ============================================================
passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await findUserById(id)
        const userInfo: DeserializeUser = deserializeUserSchema.parse(user);
        done(null, userInfo);
    } catch (error) {
        throwError(402, "Error occured in deserialize user.")
        done(error);
    }
});

export default passport;
