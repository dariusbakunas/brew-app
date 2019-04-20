import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import session, { SessionOptions } from 'express-session';
import helmet, { IHelmetConfiguration } from 'helmet';
import { IncomingMessage } from 'http';
import proxy, { Config } from 'http-proxy-middleware';
import jwt from 'jsonwebtoken';
import logger from 'morgan';
import passport from 'passport';
import path from 'path';
import uuidv4 from 'uuid/v4';
import { User } from '../types';
import auth0Strategy from './middleware/auth0';
import authApiToken from './middleware/authApiToken';
import serverRenderer from './middleware/renderer';
import secured from './middleware/secured';
import authRoutes from './routes/auth';

if (!process.env.SESSION_SECRET) {
  throw new Error('`env.SESSION_SECRET` is required for sessions');
}

if (!process.env.AUTH0_CLIENT_ID || !process.env.AUTH0_CLIENT_SECRET || !process.env.AUTH0_DOMAIN) {
  throw new Error('Make sure all AUTH0 environment variables are specified');
}

const app = express();

app.use(compression());

// force HTTPS in production
app.get('*', (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect(`https://${req.headers.host}${req.url}`);
  } else {
    next();
  }
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname));

app.use((req, res, next) => {
  res.locals.nonce = uuidv4();
  next();
});

const apiProxyConfig: Config = {
  changeOrigin: true,
  onError: (err, req, res) => {
    res.writeHead(500, {
      'Content-Type': 'application/json',
    });

    res.end(JSON.stringify({ message: err.message }));
  },
  onProxyReq: (proxyReq, req: IncomingMessage & { accessToken: string, user: User }) => {
    const token = jwt.sign({ user: req.user || {} }, process.env.JWT_SECRET);
    proxyReq.setHeader('auth-token', token);
    proxyReq.setHeader('authorization', `Bearer ${req.accessToken}`);

    if (process.env.STAGING === 'true') {
      proxyReq.setHeader('X-SERVER-SELECT', 'brew_api_staging_upstream');
    } else {
      proxyReq.removeHeader('X-SERVER-SELECT');
    }
  },
  target: process.env.BREW_API_HOST,
};

const helmetConfig: IHelmetConfiguration = {
  contentSecurityPolicy: {
    directives: {
      scriptSrc: [
        '\'self\'',
        (req, res) => `'nonce-${res.locals.nonce}'`,
      ],
    },
  },
  frameguard: { action: 'deny' },
  referrerPolicy: { policy: 'no-referrer' },
};

const sessionConfig: SessionOptions = {
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
  name: 'brew-app',
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
};

if (process.env.NODE_ENV !== 'production') {
  const memcached = require('connect-memcached');
  const MemcachedStore = memcached(session);
  sessionConfig.store = new MemcachedStore({
    hosts: [`${process.env.MEMCACHED_HOST}:${process.env.MEMCACHED_PORT || 11211}`],
  });
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sessionConfig.cookie.secure = true; // serve secure cookies
}

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
router.use('/privacy', serverRenderer);
router.use('/activate', serverRenderer);
router.use('/terms', serverRenderer);

router.use('/api', authApiToken);
router.use('/api', proxy(apiProxyConfig));

app.use(express.static(path.resolve(__dirname, '.')));

router.use('^/$', secured(), serverRenderer);
router.use('/profile', secured(), serverRenderer);
router.use('/inventory', secured(), serverRenderer);
router.use('/recipes', secured(), serverRenderer);
router.use('/sessions', secured(), serverRenderer);
router.use('/tools', secured(), serverRenderer);

// redirect top level ingredients to child hops page
router.use('/ingredients(/?)$', (req, res) => res.redirect('/ingredients/hops'));
router.use('/ingredients/*', secured(), serverRenderer);

// Admin routes
router.use('/users', secured(), serverRenderer);
router.use('/roles', secured(), serverRenderer);
router.use('/invitations', secured(), serverRenderer);

router.use('/register', secured(), serverRenderer);

app.use(router);
app.use(logger('dev'));
app.use(cookieParser());

export default app;
