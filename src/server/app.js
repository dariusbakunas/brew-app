import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import passport from 'passport';
import Auth0Strategy from 'passport-auth0';
import serverRenderer from './middleware/renderer';
import authRoutes from './routes/auth';
import secured from './middleware/secured';

if (!process.env.SESSION_SECRET) throw new Error('`env.SESSION_SECRET` is required for sessions');

const app = express();

const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
};

// Configure Passport to use Auth0
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  },
);

if (app.get('env') === 'production') {
  sess.cookie.secure = true; // serve secure cookies, requires https
}

app.use(session(sess));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

const router = express.Router();

router.use('/', authRoutes);
router.use('^/$', secured(), serverRenderer);
app.use(router);
app.use(express.static(path.resolve(__dirname, '.')));
app.use(logger('dev'));
app.use(cookieParser());

export default app;
