import compression from 'compression';
import { Express } from 'express';
import express from 'express';
import { SessionOptions } from 'express-session';
import helmet from 'helmet';
import { IncomingMessage } from 'http';
import proxy from 'http-proxy-middleware';
import { Config } from 'http-proxy-middleware';
import jwt from 'jsonwebtoken';
import next from 'next';
import passport from 'passport';
import uuidv4 from 'uuid/v4';
import auth0Strategy from './middleware/auth0';
import authApiToken from './middleware/authApiToken';
import { UserStatus } from '../types';
import errorHandler from './errorHandler';
import router from './router';

const session = require('express-session');

interface IGetUserAuthInfoRequest extends IncomingMessage {
  user: any;
  accessToken: string;
}

interface IServer extends Express {
  nextConfig?: any;
}

const dev = process.env.NODE_ENV !== 'production';

if (!process.env.SESSION_SECRET) {
  throw new Error('`env.SESSION_SECRET` is required for sessions');
}

if (!process.env.AUTH0_CLIENT_ID || !process.env.AUTH0_CLIENT_SECRET || !process.env.AUTH0_DOMAIN) {
  throw new Error('Make sure all AUTH0 environment variables are specified');
}

const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      scriptSrc: [
        '\'strict-dynamic\'',
        '\'unsafe-inline\'',
        (_, res) => `'nonce-${res.locals.nonce}'`,
      ],
    },
  },
  frameguard: { action: 'deny' },
  referrerPolicy: { policy: 'no-referrer' },
};

if (dev) {
  helmetConfig.contentSecurityPolicy.directives.scriptSrc.push('\'unsafe-eval\'');
}

const apiProxyConfig: Config = {
  changeOrigin: true,
  pathRewrite: {'^/api' : ''},
  onError: (err, _req, res) => {
    res.writeHead(500, {
      'Content-Type': 'application/json',
    });

    res.end(JSON.stringify({ message: err.message }));
  },
  onProxyReq: (proxyReq, req: IGetUserAuthInfoRequest) => {
    if (!req.headers['auth-token']) {
      console.log(process.env.JWT_SECRET);
      const token = jwt.sign({ user: req.user || { status: UserStatus.GUEST } }, process.env.JWT_SECRET);
      proxyReq.setHeader('auth-token', token);
    }

    proxyReq.setHeader('authorization', `Bearer ${req.accessToken}`);

    if (process.env.STAGING === 'true') {
      proxyReq.setHeader('X-SERVER-SELECT', 'brew_api_staging_upstream');
    } else {
      proxyReq.removeHeader('X-SERVER-SELECT');
    }
  },
  target: process.env.BREW_API_HOST,
};

const sessionConfig: SessionOptions = {
  cookie: {},
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: null,
};

if (process.env.NODE_ENV !== 'production') {
  const FileStore = require('session-file-store')(session);
  // TODO: dev memcache stopped working after next.js conversion?
  //const MemcachedStore = require('connect-memcached')(session);
  // sessionConfig.store = new MemcachedStore({
  //   hosts: [`${process.env.MEMCACHED_HOST}:${process.env.MEMCACHED_PORT || 11211}`],
  // });
  sessionConfig.store = new FileStore({});
}

export default (getRoutes) => {
  const app = next({ dev });
  const handle = app.getRequestHandler();
  const nextConfig = app.nextConfig;

  const initNext = () => {
    return app
      .prepare()
      .then(() => {
        const server: IServer = express();
        server.use(compression());

        if (server.get('env') === 'production') {
          server.set('trust proxy', 1); // trust first proxy
          sessionConfig.cookie.secure = true; // serve secure cookies
        }

        server.use('/api', authApiToken);
        server.use('/api', proxy(apiProxyConfig));

        // Create a nonce on every request and make it available to other middleware
        server.use((_, res, nxt) => {
          res.locals.nonce = Buffer.from(uuidv4()).toString('base64');
          nxt();
        });

        server.use(helmet(helmetConfig));
        server.use(session(sessionConfig));
        passport.use(auth0Strategy);
        server.use(passport.initialize());
        server.use(passport.session());
        //server.use(logger('dev'));

        server.nextConfig = app.nextConfig;
        return server;
      });
  };

  const attachNextRoutes = (server) => {
    const routes = router(app, getRoutes);

    // force HTTPS in production
    server.get('*', (req, res, nxt) => {
      if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
        res.redirect(`https://${req.headers.host}${req.url}`);
      } else {
        nxt();
      }
    });

    server.use('/', routes);
    server.get('*', (req, res) => handle(req, res));
    return server;
  };

  const startServer = (server) => {
    const { port } = nextConfig;
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://0.0.0.0:${port}`);
    });
  };

  return Promise.resolve(app)
    .then(initNext)
    .then(attachNextRoutes)
    .then(startServer)
    .catch(errorHandler);
};
