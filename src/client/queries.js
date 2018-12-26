import gql from 'graphql-tag';

export const GET_ALL_HOPS = gql`
  query GetAllHops{
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

export const CREATE_HOP = gql`
  mutation CreateHop($input: HopInput!) {
    createHop(input: $input) {
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

export const GET_ALL_COUNTRIES = gql`
  query GetAllCountries{
    countries {
      id
      name
    }
  }
`;

export const REMOVE_HOP = gql`
  mutation RemoveHop($id: ID!) {
    removeHop(id: $id)
  }
`;
