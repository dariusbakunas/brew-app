import { NextFunction, Request, Response } from 'express';
import * as React from 'react';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import xss from 'xss';
import App from '../../client/App';
import formatClientError from '../../client/errors/formatClientError';
import { ServerContextProvider } from '../../client/ServerContext';
import { UserStatus } from '../../types';
import getApolloClient from '../apolloClient';

interface IServerContext {
  error?: { message: string };
  user: {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    isAdmin: boolean,
    status: string,
  };
}

export default (req: Request, res: Response, next: NextFunction) => {
  const apolloClient = getApolloClient(req.user || { status: UserStatus.GUEST });
  const serverContext: IServerContext = {
    user: req.user ? {
      email: req.user.email,
      firstName: req.user.firstName,
      id: req.user.id,
      isAdmin: req.user.isAdmin,
      lastName: req.user.lastName,
      status: req.user.status,
    } : null,
  };

  const Tree = (
    <StaticRouter location={req.originalUrl} context={{}}>
      <ApolloProvider client={apolloClient}>
        <ServerContextProvider value={serverContext}>
          <App/>
        </ServerContextProvider>
      </ApolloProvider>
    </StaticRouter>
  );

  getDataFromTree(Tree).then(() => {
    const html = ReactDOMServer.renderToString(Tree);
    const initialApolloState = apolloClient.extract();

    res.render('index', {
      apolloState: initialApolloState ? xss(JSON.stringify(initialApolloState)) : {},
      html,
      nonce: res.locals.nonce,
      serverContext: xss(JSON.stringify(serverContext)),
      title: 'Brew',
    });
  }).catch((error) => {
    // TODO: error handling
    console.error(error);
    serverContext.error = formatClientError(error);

    const html = ReactDOMServer.renderToString(
      <StaticRouter location={req.originalUrl} context={{}}>
        <ServerContextProvider value={serverContext}>
          <App/>
        </ServerContextProvider>
      </StaticRouter>,
    );

    res.render('index', {
      html,
      nonce: res.locals.nonce,
      serverContext: xss(JSON.stringify(serverContext)),
      title: 'Brew',
    });
  });
};
