import getAuth0Token from '../auth0token';

export default (req, res, next) => {
  getAuth0Token()
    .then(({ accessToken }) => {
      req.accessToken = accessToken;
      next();
    });
};
