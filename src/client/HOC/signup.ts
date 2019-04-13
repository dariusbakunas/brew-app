import gql from 'graphql-tag';
import { graphql } from 'react-apollo'

const REGISTER = gql`
  mutation Register($input: RegistrationInput!) {
    register(input: $input) {
      id
      status
    }
  }
`;

export interface IRegisterInput {
  input: {
    code: string,
    email: string,
    firstName: string,
    lastName: string,
    username: string,
  };
}

export const signUp = graphql(REGISTER, {
  name: 'register',
});
