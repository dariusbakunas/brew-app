import getAuth0Token from './auth0token';

export default (req, _res, next) => {
  getAuth0Token()
    .then(({ accessToken }) => {
      req.accessToken = accessToken;
      next();
    });
};
