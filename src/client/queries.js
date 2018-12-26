import gql from 'graphql-tag';

export const GET_ALL_HOPS = gql`
  query getAllHops{
    hops {
      id
      name
      aaHigh
      aaLow
      betaHigh
      betaLow
      aroma
      bittering
      origin {
        name
      }
    }
  }
`;

export const CREATE_INVITATION = gql`
  mutation CreateInvitation($email: String!, $sendEmail: Boolean) {
    createInvitation(email: $email, sendEmail: $sendEmail) {
      id
      email
      code
    }
  }
`;

export const GET_ALL_INVITATIONS = gql`
  query GetAllInvitations{
    invitations {
      id
      code
      email
    }
  }
`;

export const DELETE_INVITATION = gql`
  mutation DeleteInvitation($email: String!){
    deleteInvitation(email: $email)
  }
`;

export const GET_ALL_USERS = gql`
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

export const REMOVE_USER = gql`
  mutation RemoveUser($id: ID!) {
    removeUser(id: $id)
  }
`;
