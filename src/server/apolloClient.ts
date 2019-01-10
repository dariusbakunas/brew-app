import * as fetch from 'node-fetch';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import * as jwt from 'jsonwebtoken';
import getAuth0Token from './auth0token';

type User = {
  email: string,
  firstName: string,
  initialAuth: boolean,
  lastName: string,
  username: string
};

export default function getApolloClient(requestUser: User) {
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
    // @ts-ignore
    fetch,
    uri: process.env.BREW_API_HOST,
  });

  return new ApolloClient({
    ssrMode: true,
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
}
