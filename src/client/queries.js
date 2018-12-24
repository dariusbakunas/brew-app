import gql from 'graphql-tag';

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
