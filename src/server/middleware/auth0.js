import passport from 'passport';
import Auth0Strategy from 'passport-auth0';
import gql from 'graphql-tag';
import getApolloClient from '../apolloClient';

const getUserByEmail = (apolloClient, email) => apolloClient
  .query({
    query: gql`
      query GetUserByEmail($email: String!) {
        userByEmail(email: $email) {
          id
          email
          username
          firstName
          lastName
          status
        }
      }
    `,
    variables: {
      email,
    },
  });

const createUser = (apolloClient, user) => apolloClient.mutate({
  mutation: gql`
      mutation CreateUser($input: UserInput!) {
        createUser(input: $input) {
          id
          email
          username
          firstName
          lastName
          status
        }
      }
    `,
  variables: {
    input: user,
  },
});

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const verify = (accessToken, refreshToken, extraParams, profile, done) => {
  // accessToken is the token to call Auth0 API (not needed in the most cases)
  // extraParams.id_token has the JSON Web Token
  // profile has all the information from the user
  const requestUser = {
    email: profile.emails[0].value,
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    username: profile.user_id,
  };

  const apolloClient = getApolloClient(requestUser);

  getUserByEmail(apolloClient, profile.emails[0].value)
    .then((user) => {
      if (user.data.userByEmail) {
        done(null, user.data.userByEmail);
      }

      const newUser = {
        ...requestUser,
        status: 'NEW',
      };

      createUser(apolloClient, newUser)
        .then(createUserResult => done(null, createUserResult.data.createUser))
        .catch(err => done(err));
    }).catch((err) => {
      done(err);
    });
};

// Configure Passport to use Auth0
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
  },
  verify,
);

export default strategy;
