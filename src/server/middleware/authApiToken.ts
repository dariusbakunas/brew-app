import { NextFunction, Request, Response } from 'express';
import getAuth0Token from '../auth0token';

export default (req: Request & { accessToken: string }, res: Response, next: NextFunction) => {
  getAuth0Token()
    .then(({ accessToken }) => {
      req.accessToken = accessToken;
      next();
    });
};
