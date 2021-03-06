import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { User } from '../../types';

interface IRemoveUserResponse {
  removeUser: string;
}

const REMOVE_USER = gql`
  mutation RemoveUser($id: ID!) {
    removeUser(id: $id)
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UserInput!) {
    updateUser(id: $id, input: $input) {
      id
      firstName
      lastName
      email
      roles {
        id
        code
      }
    }
  }
`;

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      username
      email
      firstName
      lastName
      status
      isAdmin
      roles {
        id
      }
    }
  }
`;

const GET_ALL_USERS = gql`
  query GetAllUsers{
    users {
      id
      username
      email
      status
    }
  }
`;

export const getUserQuery = graphql<{ userId: string }>(GET_USER, {
  name: 'getUser',
  options: (props) => ({
    variables: {
      id: props.userId,
    },
  }),
});

export const removeUser = graphql<any, IRemoveUserResponse>(REMOVE_USER, {
  name: 'removeUser',
  options: {
    update: (cache, { data: { removeUser: id } }) => {
      const { users } = cache.readQuery({ query: GET_ALL_USERS });
      cache.writeQuery({
        data: {
          users: users.filter((user: User) => user.id !== id),
        },
        query: GET_ALL_USERS,
      });
    },
  },
});

export const updateUserMutation = graphql(UPDATE_USER, {
  name: 'updateUser',
});

export const getAllUsers = graphql(GET_ALL_USERS, { name: 'getUsers' });
