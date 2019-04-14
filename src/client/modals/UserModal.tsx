import sortBy from 'lodash.sortby';
import React from 'react';
import { compose } from 'react-apollo';
import { User, UserRole } from '../../types';
import { Button, Form } from '../components';
import CheckboxList from '../components/CheckboxList';
import { InputChangeHandlerType } from '../components/Form/Input';
import { getRolesQuery, getUserQuery } from '../HOC/users';
import Modal from './Modal';

interface IUserModalProps {
  id: string;
  onHide?: () => void;
  getUser: {
    loading: boolean,
    user: User,
  };
  getRoles: {
    loading: boolean,
    roles: Array<{
      id: string,
      name: string,
      code: string,
    }>,
  };
  open: boolean;
  userId: string;
}

type UserModalState = User & {
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
                    onChange={(items) => console.log(items)}
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

  private getRoleItems = (allRoles: Array<UserRole & { id: string }>, userRoles: Array<UserRole & { id: string }>) => {
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

  private handleChange: InputChangeHandlerType = (e, { name, value }) => this.setState({ [name]: value });

  private handleHide = () => {
    if (this.props.onHide) {
      this.props.onHide();
    }
  }

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>, closeModal: () => void) => {
    e.preventDefault();
  }
}

export default compose(
  getRolesQuery,
  getUserQuery,
)(UserModal);
