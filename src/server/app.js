import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import passport from 'passport';
import helmet from 'helmet';
import uuidv4 from 'uuid/v4';
import jwt from 'jsonwebtoken';
import proxy from 'http-proxy-middleware';
import serverRenderer from './middleware/renderer';
import authRoutes from './routes/auth';
import secured from './middleware/secured';
import auth0Strategy from './middleware/auth0';
import { USER_STATUS } from '../contants';

if (!process.env.SESSION_SECRET) throw new Error('`env.SESSION_SECRET` is required for sessions');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname));

app.use((req, res, next) => {
  res.locals.nonce = uuidv4();
  next();
});

const apiProxyConfig = {
  target: process.env.BREW_API_HOST,
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res, options) => {
    const token = jwt.sign({ user: req.user ? req.user : { status: USER_STATUS.GUEST } }, process.env.JWT_SECRET);
    proxyReq.setHeader('auth-token', token);
  },
};

const helmetConfig = {
  frameguard: { action: 'deny' },
  referrerPolicy: { policy: 'no-referrer' },
  contentSecurityPolicy: {
    directives: {
      scriptSrc: [
        "'self'",
        (req, res) => `'nonce-${res.locals.nonce}'`,
      ],
    },
  },
};

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
};

app.use(helmet(helmetConfig));

if (app.get('env') === 'production') {
  sessionConfig.cookie.secure = true; // serve secure cookies, requires https
}

app.use(session(sessionConfig));

passport.use(auth0Strategy);
app.use(passport.initialize());
app.use(passport.session());

const router = express.Router();

router.use('/', authRoutes);
router.use('/login', serverRenderer);

router.use('/api', proxy(apiProxyConfig));

app.use(express.static(path.resolve(__dirname, '.')));

router.use('^/$', secured(), serverRenderer);
router.use('/register', secured(), serverRenderer);

app.use(router);
app.use(logger('dev'));
app.use(cookieParser());

export default app;
