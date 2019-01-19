import express from 'express';

export default () => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.user) {
    if (req.user.status === 'GUEST' && req.originalUrl !== '/register') {
      return res.redirect('/register');
    }

    if (req.user.status === 'NEW' && req.originalUrl !== '/activate') {
      return res.redirect('/activate');
    }

    return next();
  }

  return res.redirect('/login');
};
