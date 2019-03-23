import { Router, Request } from 'express';
import passport from 'passport';
import secured from './middleware/secured';

const router = Router();

const routeHandle = (request, response, app, pageName) => {
  const page = `/${pageName}`;
  const queryParams = request.params;
  app.render(request, response, page, queryParams);
};

export default (app, getRoutes) => {
  const routes = getRoutes();

  // @ts-ignore
  Object.entries(routes).forEach(([path, { page, requireAuth }]) => {
    if (requireAuth) {
      router.use(`${path}$`, secured);
    }

    router.get(path, (req, res) => routeHandle(req, res, app, page))
  });

  router.get('/auth', passport.authenticate('auth0', {
    scope: 'openid email profile',
  }), (_, res) => {
    res.redirect('/');
  });

  // Perform the final stage of authentication and redirect to previously requested URL or '/user'
  router.get('/callback', (req: Request, res, next) => {
    passport.authenticate('auth0', (err, user) => {
      if (err) { return next(err); }
      console.log(`HERE: ${JSON.stringify(user)}`);
      if (!user) { return res.redirect('/login'); }

      return req.login(user, (reqErr) => {
        if (reqErr) { return next(reqErr); }
        return res.redirect('/');
      });
    })(req, res, next);
  });

  // Perform session logout and redirect to login page
  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  });

  router.get('/currentUser', (req, res) => {
    const user = req.user || {};

    res.json({
      email: user.email,
      isAdmin: user.isAdmin,
      roles: user.roles,
      status: user.status,
    });
  });

  return router;
};
