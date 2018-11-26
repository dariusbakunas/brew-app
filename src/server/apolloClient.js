import fetch from 'node-fetch';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import jwt from 'jsonwebtoken';

export default function getApolloClient(requestUser) {
  const authLink = setContext((req, { headers }) => {
    const token = jwt.sign({ user: requestUser }, process.env.JWT_SECRET);

    return {
      headers: {
        ...headers,
        'auth-token': token,
      },
    };
  });

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
