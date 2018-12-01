import React from 'react';
import xss from 'xss';
import ReactDOMServer from 'react-dom/server';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { StaticRouter } from 'react-router-dom';
import App from '../../client/App';
import getApolloClient from '../apolloClient';

export default (req, res, next) => {
  const apolloClient = getApolloClient(req.user);
  const context = {};

  const Tree = (
    <StaticRouter location={req.originalUrl} context={context}>
      <ApolloProvider client={apolloClient}>
        <App/>
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
    });
  }).catch((error) => {
    // TODO: error handling
    console.error(error);
    res.send('Error');
  });
};
