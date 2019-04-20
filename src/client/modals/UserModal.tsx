import { ApolloError } from 'apollo-client';
import sortBy from 'lodash.sortby';
import React from 'react';
import { compose } from 'react-apollo';
import { User, UserRole } from '../../types';
import { Button, Form } from '../components';
import CheckboxList from '../components/CheckboxList';
import { InputChangeHandlerType } from '../components/Form/Input';
import handleGraphQLError from '../errors/handleGraphQLError';
import { getRolesQuery } from '../HOC/roles';
import { getUserQuery, updateUserMutation } from '../HOC/users';
import Modal from './Modal';

interface IUserInput {
  email: string;
  firstName: string;
  lastName: string;
  roleIds: string[];
}

interface IUser {
  email: string;
  firstName: string;
  isAdmin: boolean;
  lastName: string;
  status: string;
  username: string;
  roles: Array<{ id: string }>;
}

interface IUserModalProps {
  id: string;
  onHide?: () => void;
  getUser: {
    loading: boolean,
    user: IUser,
  };
  getRoles: {
    loading: boolean,
    roles: Array<{
      id: string,
      code: string,
      name: string,
    }>,
  };
  updateUser?: (args: { variables: { id: string, input: IUserInput } }) => Promise<void>;
  open: boolean;
  userId: string;
}

type UserModalState = IUser & {
  error?: string,
  loading: boolean,
  validationErrors: {
    [key: string]: string,
  },
};

export class UserModal extends React.Component<IUserModalProps> {
  private static getDefaultState: () => UserModalState = () => ({
    email: null,
    error: null,
    firstName: null,
    id: null,
    isAdmin: false,
    lastName: null,
    loading: false,
    roles: [],
    status: null,
    username: null,
    validationErrors: null,
  })

  public readonly state: UserModalState;
  private _isMounted: boolean;

  constructor(props: IUserModalProps) {
    super(props);

    this.state = {
      ...UserModal.getDefaultState(),
      ...props.getUser.user,
    };
  }

  public componentDidMount(): void {
    this._isMounted = true;
  }

  public componentWillUnmount(): void {
    this._isMounted = false;
  }

  public componentDidUpdate(prevProps: Readonly<IUserModalProps>): void {
    if (prevProps.getUser.user !== this.props.getUser.user) {
      if (this._isMounted) {
        this.setState({
          ...this.props.getUser.user,
        });
      }
    }
  }

  public render() {
    const {
      id,
      open,
      getUser: { loading: getUserLoading, user },
      getRoles: { loading: getRolesLoading, roles: allRoles },
    } = this.props;

    const {
      error,
      validationErrors,
      loading: submitLoading,
      email,
      firstName,
      lastName,
      roles: userRoles,
    } = this.state;

    const loading = getUserLoading || getRolesLoading || submitLoading;

    const roleItems = this.getRoleItems(allRoles, userRoles);

    return (
      <Modal
        id={id}
        error={error}
        header={user ? user.username : 'User'}
        loading={loading}
        onHide={this.handleHide}
        open={open}
        render={(close) => (
          <Form onSubmit={(e) => this.handleSubmit(e, close)}>
            <Form.Fieldset layout='stacked'>
              <Form.Input
                disabled={loading}
                error={validationErrors ? validationErrors.email : null}
                label='Email'
                name='email'
                onChange={this.handleChange}
                value={email || ''}
                required={true}
              />
              <div className='uk-margin'>
                <Form.Input
                  disabled={loading}
                  error={validationErrors ? validationErrors.email : null}
                  label='First Name'
                  name='firstName'
                  onChange={this.handleChange}
                  value={firstName || ''}
                  required={true}
                />
              </div>
              <div className='uk-margin'>
                <Form.Input
                  disabled={loading}
                  error={validationErrors ? validationErrors.email : null}
                  label='Last Name'
                  name='lastName'
                  onChange={this.handleChange}
                  value={lastName || ''}
                  required={true}
                />
              </div>
              <div className='uk-margin'>
                <label>Roles:</label>
                <div className='uk-panel uk-panel-scrollable uk-resize-vertical'>
                  <CheckboxList
                    onChange={this.handleRoleChange}
                    items={roleItems}
                  />
                </div>
              </div>
            </Form.Fieldset>
            <div className='uk-text-right'>
              <Button className='uk-modal-close uk-margin-small-right' disabled={loading}>Cancel</Button>
              <Button variation='primary' type='submit' disabled={loading}>Submit</Button>
            </div>
          </Form>
        )}
      />
    );
  }

  private handleRoleChange = (items: { [key: string]: boolean }) => {
    const roles = Object.keys(items).filter((id) => items[id]).map((id) => ({
      id,
    }));

    this.setState({
      roles,
    });
  }

  /**
   * Join all roles array and user roles to make an array compatible with CheckboxList
   * @param allRoles all existing roles
   * @param userRoles roles that user currently has
   */
  private getRoleItems = (allRoles: Array<UserRole & { id: string }>, userRoles: Array<{ id: string }>) => {
    if (!allRoles) {
      return [];
    }

    const userRolesMap: { [key: string]: UserRole } =
      userRoles.reduce((acc: {[key: string]: UserRole}, role: UserRole & { id: string }) => {
        acc[role.id] = role;
        return acc;
      }, {});

    return sortBy(
      allRoles.map((role) => ({ label: role.name, key: role.id, checked: !!userRolesMap[role.id] })),
      ['label'],
    );
  }

  /**
   * Handle all input element changes, save { [name]: value } to component state
   * @param e
   * @param name input element name
   * @param value input element value
   */
  private handleChange: InputChangeHandlerType = (e, { name, value }) => this.setState({ [name]: value });

  private handleHide = () => {
    if (this.props.onHide) {
      this.props.onHide();
    }
  }

  /**
   * Submit user update form
   * @param e form event
   * @param callback run this on successful submission
   */
  private handleSubmit = (e: React.FormEvent<HTMLFormElement>, callback: () => void) => {
    e.preventDefault();

    const { firstName, lastName, email, roles } = this.state;
    const { updateUser, userId } = this.props;

    const userInput: IUserInput = {
      email,
      firstName,
      lastName,
      roleIds: roles.map((role) => role.id),
    };

    updateUser({ variables: { id: userId, input: userInput }}).then(() => {
      callback();
    }).catch((err: ApolloError) => {
      const { validationErrors, errorMessage } = handleGraphQLError(err, false);
      this.setState({
        error: errorMessage,
        loading: false,
        validationErrors,
      });
    });
  }
}

export default compose(
  getRolesQuery,
  getUserQuery,
  updateUserMutation,
)(UserModal);
