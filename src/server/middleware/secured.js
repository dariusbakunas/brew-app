export default () => (req, res, next) => {
  if (req.user) {
    if (req.user.status === 'GUEST' && req.originalUrl !== '/register') {
      return res.redirect('/register');
    }

    if (req.user.status === 'NEW' && req.originalUrl !== '/activate') {
      return res.redirect('/activate');
    }

    return next();
  }

  req.session.returnTo = req.originalUrl;
  res.redirect('/login');
};
