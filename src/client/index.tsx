import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/main.scss';
import 'uikit';
import { ServerContextProvider } from './ServerContext';
import App from './App';

declare global {
  interface Window {
    UIkit: any;
    __APOLLO_STATE__: any;
    __SERVER_CONTEXT__: any;
  }
}

const errLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((err) => {
      const { message, locations, path } = err;

      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      );
    });
  }

  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
  link: errLink.concat(createHttpLink({ uri: '/api', credentials: 'same-origin' })),
});

ReactDOM.hydrate(
  <ApolloProvider client={client}>
    <Router>
      <ServerContextProvider value={window.__SERVER_CONTEXT__}>
        <App/>
      </ServerContextProvider>
    </Router>
  </ApolloProvider>,
  document.getElementById('root'),
);
