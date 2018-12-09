import fetch from 'node-fetch';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import jwt from 'jsonwebtoken';
import getAuth0Token from './auth0token';

export default function getApolloClient(requestUser) {
  const authLink = setContext((req, { headers }) => new Promise((resolve, reject) => {
    // do some async lookup here
    getAuth0Token()
      .then(({ accessToken }) => {
        const userToken = jwt.sign({ user: requestUser }, process.env.JWT_SECRET);

        resolve({
          headers: {
            ...headers,
            authorization: `Bearer ${accessToken}`,
            'auth-token': userToken,
          },
        });
      })
      .catch((err) => {
        reject(err);
      });
  }));

  const httpLink = createHttpLink({
    fetch,
    uri: process.env.BREW_API_HOST,
  });

  return new ApolloClient({
    ssrMode: true,
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
}
