import React from 'react';
import xss from 'xss';
import ReactDOMServer from 'react-dom/server';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { StaticRouter } from 'react-router-dom';
import App from '../../client/App';
import getApolloClient from '../apolloClient';
import { ServerContextProvider } from '../../client/ServerContext';
import ErrorBoundary from '../../client/errors/errorBoundary';

export default (req, res, next) => {
  const apolloClient = getApolloClient(req.user || {});
  const serverContext = {
    user: req.user ? {
      email: req.user.email,
      firstName: req.user.firstName,
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
      title: 'Brew',
      serverContext: xss(JSON.stringify(serverContext)),
    });
  }).catch((error) => {
    // TODO: error handling
    serverContext.error = 'Unknown error occurred, please try again';

    const html = ReactDOMServer.renderToString(
      <StaticRouter location={req.originalUrl} context={{}}>
        <ServerContextProvider value={serverContext}>
          <App/>
        </ServerContextProvider>
      </StaticRouter>
    );

    res.render('index', {
      html,
      nonce: res.locals.nonce,
      serverContext: xss(JSON.stringify(serverContext)),
      title: 'Brew',
    });
  });
};
