import { ApolloError } from 'apollo-client';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import {
  Container, IconNav, Spinner, Table,
} from '../components';
import handleGraphQLError from '../errors/handleGraphQLError';
import withServerContext from '../HOC/withServerContext';
import Main from '../layouts/main';
import { GET_ALL_USERS, REMOVE_USER } from '../queries';
import { User, UserStatus } from '../types';

interface IUsersPageProps {
  user: {
    id: string,
  };
  data: {
    loading: boolean,
    users: User[],
    error: ApolloError,
  };
  removeUser: (args: { variables: { id: string } }) => Promise<void>;
}

class UsersPage extends React.Component<IUsersPageProps> {
  private static getStatusString(status: UserStatus) {
    return {
      [UserStatus.ACTIVE]: 'active',
      [UserStatus.GUEST]: 'guest',
      [UserStatus.INACTIVE]: 'inactive',
      [UserStatus.NEW]: 'new',
    }[status];
  }

  private static handleError(error: ApolloError) {
    const { errorMessage } = handleGraphQLError(error, false);

    window.UIkit.notification({
      message: errorMessage,
      pos: 'top-right',
      status: 'danger',
      timeout: 5000,
    });
  }

  public componentDidUpdate(prevProps: Readonly<IUsersPageProps>): void {
    if (prevProps.data !== this.props.data) {
      if (this.props.data.error) {
        UsersPage.handleError(this.props.data.error);
      }
    }
  }

  // TODO: replace Mutation with HOC for easier testing

  public render() {
    const { loading, users = [], error } = this.props.data;

    if (error) {
      return (
        <span>{JSON.stringify(error)}</span>
      );
    }

    return (
      <Main>
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
      </Main>
    );
  }

  private handleRemove({ id, username }: Partial<User>) {
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
    });
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
              users: users.filter((user: User) => user.id !== id),
            },
            query: GET_ALL_USERS,
          });
        },
      },
    }),
  )(UsersPage),
);
