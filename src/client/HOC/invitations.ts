import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { Invitation } from "../../types";

const GET_ALL_INVITATIONS = gql`
  query GetAllInvitations {
    invitations {
      id
      code
      email
    }
  }
`;

const CREATE_INVITATION = gql`
  mutation CreateInvitation($email: String!, $sendEmail: Boolean) {
    createInvitation(email: $email, sendEmail: $sendEmail) {
      id
      email
      code
    }
  }
`;

const DELETE_INVITATION = gql`
  mutation DeleteInvitation($email: String!) {
    deleteInvitation(email: $email)
  }
`;

export interface IGetInvitationsResponse {
  loading: boolean;
}

export interface IDeleteInvitationResponse {
  deleteInvitation: string;
}

export interface ICreateInvitationResponse {
  createInvitation: {
    id: string;
    email: string;
    code: string;
  };
}

export const deleteInvitationMutation = graphql<any, IDeleteInvitationResponse>(DELETE_INVITATION, {
  name: "deleteInvitation",
  options: {
    update: (cache, { data: { deleteInvitation: id } }) => {
      const { invitations } = cache.readQuery({ query: GET_ALL_INVITATIONS });
      cache.writeQuery({
        data: {
          invitations: invitations.filter((invitation: Invitation) => invitation.id !== id),
        },
        query: GET_ALL_INVITATIONS,
      });
    },
  },
});

export const createInvitationMutation = graphql<any, ICreateInvitationResponse>(CREATE_INVITATION, {
  name: "createInvitation",
  options: {
    update: (cache, { data: { createInvitation: invitation } }) => {
      const { invitations } = cache.readQuery({ query: GET_ALL_INVITATIONS });
      cache.writeQuery({
        data: { invitations: [...invitations, invitation] },
        query: GET_ALL_INVITATIONS,
      });
    },
  },
});

export const getAllInvitationsQuery = graphql<any, IGetInvitationsResponse>(GET_ALL_INVITATIONS, { name: "getAllInvitations" });
