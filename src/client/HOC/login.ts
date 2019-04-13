import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const GET_LOGIN_QUOTE = gql`
  query GetRandomQuote {
    randomQuote {
      text
      author
    }
  }
`;

export const getLoginQuote = graphql(GET_LOGIN_QUOTE, { name: 'getLoginQuote' });
