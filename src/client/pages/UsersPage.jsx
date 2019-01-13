import React from 'react';
import PropTypes from 'prop-types';
import { graphql, Mutation } from 'react-apollo';
import {
  Container, Table, Spinner, IconNav,
} from '../components';
import { USER_STATUS } from '../../contants';
import handleGraphQLError from '../errors/handleGraphQLError';
import withServerContext from '../HOC/withServerContext';
import { GET_ALL_USERS, REMOVE_USER } from '../queries';

class UsersPage extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    data: PropTypes.shape({
      loading: PropTypes.bool,
      users: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        username: PropTypes.string,
        email: PropTypes.string,
        status: PropTypes.oneOf(Object.values(USER_STATUS)),
      })),
    }),
  };

  handleRemove(removeUser, { id, username }) {
    const options = {
      labels: { ok: 'Yes', cancel: 'No' },
    };

    window.UIkit.modal.confirm(`Are you sure you want to remove user '${username}'?`, options).then(() => {
      removeUser({ variables: { id } });
    }, () => {});
  }

  updateUsers(cache, { data: { removeUser: id } }) {
    const { users } = cache.readQuery({ query: GET_ALL_USERS });
    cache.writeQuery({
      query: GET_ALL_USERS,
      data: { users: users.filter(user => user.id !== id) },
    });
  }

  handleError(error) {
    const { errorMessage } = handleGraphQLError(error, false);

    window.UIkit.notification({
      message: errorMessage,
      status: 'danger',
      pos: 'top-right',
      timeout: 5000,
    });
  }

  getStatusString(status) {
    return {
      [USER_STATUS.ACTIVE]: 'active',
      [USER_STATUS.GUEST]: 'guest',
      [USER_STATUS.INACTIVE]: 'inactive',
      [USER_STATUS.NEW]: 'new',
    }[status];
  }

  // TODO: replace Mutation with HOC for easier testing

  render() {
    const { loading, users = [] } = this.props.data;

    return (
      <React.Fragment>
        <Container>
          <Mutation mutation={REMOVE_USER} update={this.updateUsers} onError={this.handleError}>
            {
              (removeUser, { loading: mutationLoading }) => (
                <div>
                  <Table className='uk-margin-large' size='small' stripped>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Username</Table.HeaderCell>
                        <Table.HeaderCell>Email</Table.HeaderCell>
                        <Table.HeaderCell>Status</Table.HeaderCell>
                        <Table.HeaderCell/>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {
                        users.map(user => (
                          <Table.Row key={user.id}>
                            <Table.Cell>{user.username}</Table.Cell>
                            <Table.Cell>{user.email}</Table.Cell>
                            <Table.Cell>{this.getStatusString(user.status)}</Table.Cell>
                            <Table.Cell nowrap>
                              <IconNav>
                                <IconNav.Item
                                  disabled={this.props.user.id === user.id}
                                  icon='trash'
                                  onClick={() => this.handleRemove(removeUser, user)}/>
                              </IconNav>
                            </Table.Cell>
                          </Table.Row>
                        ))
                      }
                    </Table.Body>
                  </Table>
                  <Spinner active={loading || mutationLoading}/>
                </div>
              )
            }
          </Mutation>
        </Container>
        <Spinner active={loading}/>
      </React.Fragment>
    );
  }
}

export default withServerContext(graphql(GET_ALL_USERS)(UsersPage));
