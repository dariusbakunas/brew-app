import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import passport from 'passport';
import serverRenderer from './middleware/renderer';
import authRoutes from './routes/auth';
import secured from './middleware/secured';
import auth0Strategy from './middleware/auth0';

if (!process.env.SESSION_SECRET) throw new Error('`env.SESSION_SECRET` is required for sessions');

const app = express();

const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
};

if (app.get('env') === 'production') {
  sess.cookie.secure = true; // serve secure cookies, requires https
}

app.use(session(sess));

passport.use(auth0Strategy);
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
