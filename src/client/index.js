import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router } from 'react-router-dom';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import { ServerContextProvider } from './ServerContext';
import App from './App';
import './styles/main.scss';

// loads the Icon plugin
UIkit.use(Icons);

const errLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) => console.log(
      `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
    ));
  }

  if (networkError) console.log(`[Network error]: ${networkError}`);
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
