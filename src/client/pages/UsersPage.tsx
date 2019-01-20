import * as React from 'react';
import { compose, graphql, Mutation } from 'react-apollo';
import { ApolloError } from 'apollo-client';
import {
  Container, Table, Spinner, IconNav,
} from '../components';
import handleGraphQLError from '../errors/handleGraphQLError';
import withServerContext from '../HOC/withServerContext';
import { GET_ALL_USERS, REMOVE_USER } from '../queries';
import { User, UserStatus } from '../../types';

type UsersPageProps = {
  user: {
    id: string,
  },
  data: {
    loading: boolean,
    users: User[],
  },
  removeUser: (args: { variables: { id: string } }) => Promise<void>,
};

class UsersPage extends React.Component<UsersPageProps> {
  handleRemove({ id, username }: Partial<User>) {
    const options = {
      labels: { ok: 'Yes', cancel: 'No' },
    };

    window.UIkit.modal.confirm(`Are you sure you want to remove user '${username}'?`, options).then(() => {
      this.setState({ loading: true }, () => {
        this.props.removeUser({ variables: { id } })
          .then(() => {
            this.setState({ loading: false });
          }).catch((err) => {
            this.setState({ loading: false }, () => {
              UsersPage.handleError(err);
            });
          });
      });
    }, () => {});
  }

  private static handleError(error: ApolloError) {
    const { errorMessage } = handleGraphQLError(error, false);

    window.UIkit.notification({
      message: errorMessage,
      status: 'danger',
      pos: 'top-right',
      timeout: 5000,
    });
  }

  private static getStatusString(status: UserStatus) {
    return {
      [UserStatus.ACTIVE]: 'active',
      [UserStatus.GUEST]: 'guest',
      [UserStatus.INACTIVE]: 'inactive',
      [UserStatus.NEW]: 'new',
    }[status];
  }

  // TODO: replace Mutation with HOC for easier testing

  public render() {
    const { loading, users = [] } = this.props.data;

    return (
      <React.Fragment>
        <Container>
            <Table className='uk-margin-large' size='small' stripped={true}>
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
                  users.map((user: User) => (
                    <Table.Row key={user.id}>
                      <Table.Cell>{user.username}</Table.Cell>
                      <Table.Cell>{user.email}</Table.Cell>
                      <Table.Cell>{UsersPage.getStatusString(user.status)}</Table.Cell>
                      <Table.Cell nowrap={true}>
                        <IconNav>
                          <IconNav.Item
                            disabled={this.props.user.id === user.id}
                            icon='trash'
                            onClick={() => this.handleRemove(user)}
                          />
                        </IconNav>
                      </Table.Cell>
                    </Table.Row>
                  ))
                }
              </Table.Body>
            </Table>
        </Container>
        <Spinner active={loading}/>
      </React.Fragment>
    );
  }
}

export default withServerContext(
  compose(
    graphql(GET_ALL_USERS),
    graphql(REMOVE_USER, {
      name: 'removeUser',
      options: {
        update: (cache, { data: { removeUser: id } }) => {
          const { users } = cache.readQuery({ query: GET_ALL_USERS });
          cache.writeQuery({
            data: {
              invitations: users.filter((user: User) => user.id !== id),
            },
            query: GET_ALL_USERS,
          });
        },
      },
    }),
  )(UsersPage),
);
