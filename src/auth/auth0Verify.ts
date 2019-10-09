import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import createApolloClient from '../lib/createApolloClient';
import { GetUserByEmail, GetUserByEmailVariables } from '../__generated__/GetUserByEmail';

const getUser = (apolloClient: ApolloClient<NormalizedCacheObject>, email: string) =>
  apolloClient.query<GetUserByEmail, GetUserByEmailVariables>({
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

const auth0Verify = async (
  accessToken: string,
  refreshToken: string,
  extraParams: object,
  profile: {
    emails: Array<{ value: string }>;
  },
  done: any
) => {
  const apolloClient = createApolloClient(accessToken);

  try {
    const response = await getUser(apolloClient, profile.emails[0].value);
    const {
      data: { userByEmail },
    } = response;

    return done(null, {
      accessToken,
      refreshToken,
      profile,
      status: userByEmail ? userByEmail.status : 'GUEST',
    });
  } catch (e) {
    return done(e);
  }
};

export default auth0Verify;
