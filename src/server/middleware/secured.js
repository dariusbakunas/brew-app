export default () => (req, res, next) => {
  if (req.user) {
    if (req.user.status === 'GUEST' && req.originalUrl !== '/register' && req.originalUrl !== '/favicon.ico') {
      return res.redirect('/register');
    }

    return next();
  }

  req.session.returnTo = req.originalUrl;
  res.redirect('/login');
};
