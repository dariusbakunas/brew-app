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

const GET_ALL_USERS = gql`
  query GetAllUsers{
    users {
      id
      username
      email
      status
      isAdmin
    }
  }
`;

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

export const getAllUsers = graphql(GET_ALL_USERS, { name: 'getUsers' });
