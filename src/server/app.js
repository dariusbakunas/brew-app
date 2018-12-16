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
import compression from 'compression';
import serverRenderer from './middleware/renderer';
import authRoutes from './routes/auth';
import secured from './middleware/secured';
import auth0Strategy from './middleware/auth0';
import authApiToken from './middleware/authApiToken';

if (!process.env.SESSION_SECRET) throw new Error('`env.SESSION_SECRET` is required for sessions');

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

const apiProxyConfig = {
  target: process.env.BREW_API_HOST,
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res, options) => {
    const token = jwt.sign({ user: req.user || {} }, process.env.JWT_SECRET);
    proxyReq.setHeader('auth-token', token);
    proxyReq.setHeader('authorization', `Bearer ${req.accessToken}`);
  },
  onError: (err, req, res) => {
    res.writeHead(500, {
      'Content-Type': 'application/json',
    });

    res.end(JSON.stringify({ message: err.message }));
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

if (process.env.NODE_ENV !== 'production') {
  const MemcachedStore = require('connect-memcached')(session);
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
router.use('/register', secured(), serverRenderer);

app.use(router);
app.use(logger('dev'));
app.use(cookieParser());

export default app;
