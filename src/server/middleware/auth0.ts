import gql from 'graphql-tag';
import passport from 'passport';
import Auth0Strategy from 'passport-auth0';
import { User, UserStatus } from '../../types';
import getApolloClient from '../apolloClient';

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
  accessToken,
  refreshToken,
  extraParams,
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
          status: UserStatus.GUEST,
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
  },
  verify,
);
