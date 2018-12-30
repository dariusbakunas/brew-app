import gql from 'graphql-tag';

export const GET_ALL_HOPS = gql`
  query GetAllHops($cursor: String, $limit: Int!, $sortBy: SortableHopField, $sortDirection: SortDirection){
    pagedHops(cursor: $cursor, limit: $limit, sortBy: $sortBy, sortDirection: $sortDirection) @connection(key: "hops") {
      hops {
        id
        name
        aaHigh
        aaLow
        aroma
        betaHigh
        betaLow
        bittering
        description
        origin {
          id
          name
        }
      }
      paging {
        currentCursor
        nextCursor
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
      description
      origin {
        id
        name
      }
    }
  }
`;

export const UPDATE_HOP = gql`
  mutation UpdateHop($id: ID!, $input: HopInput!) {
    updateHop(id: $id, input: $input) {
      id
      name
      aaHigh
      aaLow
      betaHigh
      betaLow
      aroma
      bittering
      description
      origin {
        id
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
