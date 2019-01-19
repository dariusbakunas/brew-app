import express from 'express';
import passport from 'passport';

const router = express.Router();

// Perform the login, after login Auth0 will redirect to callback
router.get('/auth', passport.authenticate('auth0', {
  scope: 'openid email profile',
}), (req, res) => {
  res.redirect('/');
});

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get('/callback', (req: express.Request, res, next) => {
  passport.authenticate('auth0', (err, user) => {
    if (err) { return next(err); }
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

export default router;
