import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import Auth0Strategy from 'passport-auth0';
import { User, UserStatus } from '../../types';
import getAuth0Token from './auth0token';

function getApolloClient(requestUser: User) {
  const authLink = setContext((_, { headers }) => new Promise((resolve, reject) => {
    // do some async lookup here
    getAuth0Token()
      .then(({ accessToken }) => {
        console.log(process.env.JWT_SECRET);
        const userToken = jwt.sign({ user: requestUser }, process.env.JWT_SECRET);

        const requestHeaders = {
          'authorization': `Bearer ${accessToken}`,
          ...headers,
          'auth-token': userToken,
        };

        if (process.env.STAGING === 'true') {
          requestHeaders['X-SERVER-SELECT'] = 'brew_api_staging_upstream';
        } else {
          // do not let client setting to modify this
          delete requestHeaders['X-SERVER-SELECT'];
        }

        resolve({
          headers: requestHeaders,
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

interface IUserResponse {
  userByEmail: User;
}

const getUserByEmail =
(
  apolloClient: ReturnType<typeof getApolloClient>,
  email: string,
) => apolloClient.query<IUserResponse>({
  query: gql`
      query GetUserByEmail($email: String!) {
        userByEmail(email: $email) {
          id
          email
          username
          firstName
          lastName
          isAdmin
          status
          roles {
            name
          }
        }
      }
    `,
  variables: {
    email,
  },
});

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export const verify: Auth0Strategy.VerifyFunction = (
  _accessToken,
  _refreshToken,
  _extraParams,
  profile,
  done,
) => {
  // accessToken is the token to call Auth0 API (not needed in the most cases)
  // extraParams.id_token has the JSON Web Token
  // profile has all the information from the user
  const requestUser = {
    email: profile.emails[0].value,
    firstName: profile.name.givenName,
    initialAuth: true,
    lastName: profile.name.familyName,
    username: profile.id,
  };

  const apolloClient = getApolloClient(requestUser);

  return getUserByEmail(apolloClient, profile.emails[0].value)
    .then((user) => {
      if (user.data.userByEmail) {
        done(null, user.data.userByEmail);
      } else {
        const newUser = {
          ...requestUser,
          status: UserStatus.GUEST, // new users get GUEST status
        };

        done(null, newUser);
      }
    }).catch((err) => {
      done(err);
    });
};

// @ts-ignore
export default new Auth0Strategy(
  {
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    domain: process.env.AUTH0_DOMAIN,
    state: true,
  },
  verify,
);
