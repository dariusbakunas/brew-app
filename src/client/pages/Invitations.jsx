import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import {
  Container, Table, IconNav, Spinner, Button,
} from '../components';
import handleGraphQLError from '../errors/handleGraphQLError';
import confirm from '../utils/confirm';
import InvitationModal from '../modals/InvitationModal';
import { GET_ALL_INVITATIONS, DELETE_INVITATION } from '../queries';

// TODO: handle errors for getAllInvitations call

class Invitations extends React.Component {
  static propTypes = {
    deleteInvitation: PropTypes.func,
    getAllInvitations: PropTypes.shape({
      loading: PropTypes.bool,
      invitations: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        email: PropTypes.string,
        code: PropTypes.string,
      })),
    }),
  };

  state = {
    loading: false,
  };

  handleError(error) {
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

  handleRemoveInvitation(email) {
    confirm(`Are you sure you want to remove invitation for '${email}'?`, () => {
      this.setState({ loading: true }, () => {
        this.props.deleteInvitation({ variables: { email } })
          .then(() => {
            this.setState({ loading: false });
          })
          .catch((err) => {
            this.setState({ loading: false }, () => {
              this.handleError(err);
            });
          });
      });
    });
  }

  render() {
    const { invitations, loading } = this.props.getAllInvitations;

    return (
      <div className='uk-section uk-section-small' style={{ flexGrow: 1 }}>
        <Container>
          <React.Fragment>
            {
              invitations && invitations.length ?
                <Table className='uk-margin-large' size='small' stripped>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Email</Table.HeaderCell>
                      <Table.HeaderCell>Code</Table.HeaderCell>
                      <Table.HeaderCell/>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {
                      invitations.map(invitation => (
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
            <Button variation='primary' data-uk-toggle="target: #new-invitation-modal">Create</Button>
          </React.Fragment>
        </Container>
        <InvitationModal id='new-invitation-modal'/>
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
          data: { invitations: invitations.filter(invitation => invitation.id !== id) },
        });
      },
    },
  }),
)(Invitations);
