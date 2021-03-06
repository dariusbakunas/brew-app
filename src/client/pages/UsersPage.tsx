import { ApolloError } from 'apollo-client';
import React from 'react';
import { compose } from 'react-apollo';
import { User, UserStatus } from '../../types';
import {
  Container, IconNav, Spinner, Table,
} from '../components';
import handleGraphQLError from '../errors/handleGraphQLError';
import { getAllUsers, removeUser } from '../HOC/users';
import withServerContext from '../HOC/withServerContext';
import UserModal from '../modals/UserModal';

interface IWindow {
  UIkit?: any;
}

declare var window: IWindow;

interface IUsersPageProps {
  user: {
    id: string,
  };
  getUsers: {
    loading: boolean,
    users: User[],
  };
  removeUser: (args: { variables: { id: string } }) => Promise<void>;
}

interface IUsersPageState {
  currentUser?: User;
  loading: boolean;
  userModalOpen: boolean;
}

class UsersPage extends React.Component<IUsersPageProps, IUsersPageState> {
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

  // TODO: replace Mutation with HOC for easier testing
  public readonly state: Readonly<IUsersPageState> = {
    currentUser: null,
    loading: false,
    userModalOpen: false,
  };

  public render() {
    const { loading, users = [] } = this.props.getUsers;
    const { currentUser, userModalOpen } = this.state;

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
                          icon='pencil'
                          onClick={() => this.handleEditUser(user)}
                        />
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
        {
          currentUser &&
          <UserModal
            id='user-modal'
            userId={currentUser.id}
            open={userModalOpen}
            onHide={() => this.setState({ userModalOpen: false, currentUser: null })}
          />
        }
      </React.Fragment>
    );
  }

  private handleEditUser = (user: User) => {
    this.setState({
      currentUser: user,
      userModalOpen: true,
    });
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
    getAllUsers,
    removeUser,
  )(UsersPage),
);
