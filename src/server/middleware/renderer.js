import React from 'react';
import xss from 'xss';
import ReactDOMServer from 'react-dom/server';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import App from '../../client/App';
import getApolloClient from '../apolloClient';

export default (req, res, next) => {
  const apolloClient = getApolloClient(req.user);

  const Tree = (
    <ApolloProvider client={apolloClient}>
      <App/>
    </ApolloProvider>
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
