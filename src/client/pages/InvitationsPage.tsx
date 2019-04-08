import { ApolloError } from 'apollo-client';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { Invitation } from '../../types';
import {
  Button, Container, IconNav, Spinner, Table,
} from '../components';
import handleGraphQLError from '../errors/handleGraphQLError';
import InvitationModal from '../modals/InvitationModal';
import { DELETE_INVITATION, GET_ALL_INVITATIONS } from '../queries';
import confirm from '../utils/confirm';

interface IWindow {
  UIkit?: any;
}

declare var window: IWindow;

interface IInvitationsPageProps {
  getAllInvitations: {
    loading: boolean,
    invitations: Array<Invitation & { id: string }>,
  };
  deleteInvitation: (args: { variables: { email: string } }) => Promise<void>;
}

interface IInvitationsPageState {
  loading: boolean;
  invitationModalOpen: boolean;
}

class InvitationsPage extends React.Component<IInvitationsPageProps> {
  private static handleError(error: ApolloError) {
    const { errorMessage } = handleGraphQLError(error, false);

    if (errorMessage) {
      window.UIkit.notification({
        errorMessage,
        pos: 'top-right',
        status: 'danger',
        timeout: 5000,
      });
    }
  }

  public readonly state: IInvitationsPageState = {
    invitationModalOpen: false,
    loading: false,
  };

  public render() {
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

  private handleCreateInvitation = () => {
    this.setState({
      invitationModalOpen: true,
    });
  }

  private handleRemoveInvitation(email: string) {
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
}

export default compose(
  graphql(GET_ALL_INVITATIONS, { name: 'getAllInvitations' }),
  graphql(DELETE_INVITATION, {
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
  }),
)(InvitationsPage);
