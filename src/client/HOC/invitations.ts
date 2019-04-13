import { graphql } from 'react-apollo';
import { Invitation, IRecipe } from '../../types';
import { DELETE_INVITATION, GET_ALL_INVITATIONS } from '../queries';

export interface IGetInvitationsResponse {
  loading: boolean;
  recipes: Array<IRecipe & { id: string }>;
}

export interface IDeleteInvitationResponse {
  deleteInvitation: string;
}

export const deleteInvitation = graphql<any, IDeleteInvitationResponse>(DELETE_INVITATION, {
  name: 'deleteInvitation',
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

export const getAllInvitations = graphql<any, IGetInvitationsResponse>(
  GET_ALL_INVITATIONS, { name: 'getAllInvitations' });
