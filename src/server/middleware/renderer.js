import React from 'react';
import xss from 'xss';
import ReactDOMServer from 'react-dom/server';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { StaticRouter } from 'react-router-dom';
import App from '../../client/App';
import getApolloClient from '../apolloClient';
import { ServerContextProvider } from '../../client/ServerContext';
import { USER_STATUS } from '../../contants';

export default (req, res, next) => {
  const apolloClient = getApolloClient(req.user || { status: USER_STATUS.GUEST });
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
    console.error(error);
    res.send('Error');
  });
};
