import * as React from 'react';
import { ApolloError } from 'apollo-client';
import { compose, graphql } from 'react-apollo';
import {
  Container, Table, IconNav, Spinner, Button,
} from '../components';
import handleGraphQLError from '../errors/handleGraphQLError';
import confirm from '../utils/confirm';
import InvitationModal from '../modals/InvitationModal';
import { GET_ALL_INVITATIONS, DELETE_INVITATION } from '../queries';
import { Invitation } from '../../types';

type InvitationsPageProps = {
  getAllInvitations: {
    loading: boolean,
    invitations: Array<Invitation & { id: string }>,
  },
  deleteInvitation: (args: { variables: { email: string } }) => Promise<void>,
};

type InvitationsPageState = {
  loading: boolean,
  invitationModalOpen: boolean,
};

class InvitationsPage extends React.Component<InvitationsPageProps> {
  readonly state: InvitationsPageState = {
    invitationModalOpen: false,
    loading: false,
  };

  private static handleError(error: ApolloError) {
    const { errorMessage } = handleGraphQLError(error, false);

    if (errorMessage) {
      window.UIkit.notification({
        errorMessage,
        status: 'danger',
        pos: 'top-right',
        timeout: 5000,
      });
    }
  }

  handleCreateInvitation = () => {
    this.setState({
      invitationModalOpen: true,
    });
  };

  handleRemoveInvitation(email: string) {
    confirm(`Are you sure you want to remove invitation for '${email}'?`, () => {
      this.setState({ loading: true }, () => {
        this.props.deleteInvitation({ variables: { email } })
          .then(() => {
            this.setState({ loading: false });
          })
          .catch((err) => {
            this.setState({ loading: false }, () => {
              InvitationsPage.handleError(err);
            });
          });
      });
    });
  }

  render() {
    const { invitations, loading } = this.props.getAllInvitations;
    const { invitationModalOpen } = this.state;


    return (
      <div className='uk-section uk-section-small' style={{ flexGrow: 1 }}>
        <Container>
          <React.Fragment>
            {
              invitations && invitations.length ?
                <Table className='uk-margin-large' size='small' stripped={true}>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Email</Table.HeaderCell>
                      <Table.HeaderCell>Code</Table.HeaderCell>
                      <Table.HeaderCell/>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {
                      invitations.map((invitation) => (
                        <Table.Row key={invitation.id}>
                          <Table.Cell>{invitation.email}</Table.Cell>
                          <Table.Cell>{invitation.code}</Table.Cell>
                          <Table.Cell>
                            <IconNav>
                              <IconNav.Item icon='trash' onClick={() => this.handleRemoveInvitation(invitation.email)}/>
                            </IconNav>
                          </Table.Cell>
                        </Table.Row>
                      ))
                    }
                  </Table.Body>
                </Table> :
                <div className='uk-margin-bottom'>No invitations</div>
            }
            <Spinner active={loading || this.state.loading}/>
            <Button variation='primary' onClick={this.handleCreateInvitation}>Create</Button>
          </React.Fragment>
        </Container>
        <InvitationModal
          id='new-invitation-modal'
          open={invitationModalOpen}
          onHide={() => this.setState({ invitationModalOpen: false })}
        />
      </div>
    );
  }
}

export default compose(
  graphql(GET_ALL_INVITATIONS, { name: 'getAllInvitations' }),
  graphql(DELETE_INVITATION, {
    name: 'deleteInvitation',
    options: {
      update: (cache, { data: { deleteInvitation: id } }) => {
        const { invitations } = cache.readQuery({ query: GET_ALL_INVITATIONS });
        cache.writeQuery({
          query: GET_ALL_INVITATIONS,
          data: {
            invitations: invitations.filter((invitation: Invitation) => invitation.id !== id),
          },
        });
      },
    },
  }),
)(InvitationsPage);
