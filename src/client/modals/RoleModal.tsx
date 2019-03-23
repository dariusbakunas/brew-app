import * as React from 'react';
import { graphql } from 'react-apollo';
import { Form } from '../../../components';
import handleGrpahQLError from '../../../errors/handleGraphQLError';
import { CREATE_ROLE, GET_ROLES } from '../../../queries';
import Modal from './Modal';
import { UserRole } from '../../../types';
import { InputChangeHandlerType } from '../../../components/Form/Input';

type RoleModalProps = {
  id: string,
  mutate: (args: { variables: UserRole }) => Promise<any>,
};

type RoleModalState = UserRole & {
  error: string,
  loading: boolean,
  validationErrors: {
    [key: string]: string,
  },
};

export class RoleModal extends React.Component<RoleModalProps> {
  readonly state: Readonly<RoleModalState> = {
    name: '',
    code: '',
    error: null,
    loading: false,
    validationErrors: null,
  };

  handleHide = () => {
    this.setState({
      name: '',
      code: '',
      error: null,
      send: true,
      validationErrors: null,
    });
  };

  handleChange: InputChangeHandlerType = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = (e: React.FormEvent<HTMLFormElement>, closeModal: () => void) => {
    e.preventDefault();

    const { mutate } = this.props;

    this.setState({ loading: true }, () => {
      mutate({
        variables: {
          name: this.state.name,
          code: this.state.code,
        },
      }).then(() => {
        this.setState({ loading: false }, () => {
          closeModal();
        });
      }).catch((err) => {
        const { validationErrors, errorMessage } = handleGrpahQLError(err, false);
        this.setState({
          error: errorMessage,
          loading: false,
          validationErrors,
        });
      });
    });
  };

  render() {
    const { id } = this.props;
    const {
      name, code, error, loading, validationErrors,
    } = this.state;

    return (
      <Modal
        id={id}
        header='New Invitation'
        loading={loading}
        error={error}
        onHide={this.handleHide}
        render={close => (
          <Form onSubmit={e => this.handleSubmit(e, close)}>
            <Form.Fieldset>
              <div className="uk-margin">
                <Form.Input
                  disabled={loading}
                  error={validationErrors ? validationErrors.email : null}
                  label='Name'
                  name='name'
                  value={name}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="uk-margin">
                <Form.Input
                  disabled={loading}
                  label='Code'
                  name='code'
                  value={code}
                  onChange={this.handleChange}
                />
              </div>
            </Form.Fieldset>
            <div className='uk-text-right'>
              <button className='uk-button uk-button-default uk-modal-close uk-margin-small-right' type='button' disabled={loading}>Cancel</button>
              <button className='uk-button uk-button-primary' type='submit' disabled={loading}>Submit</button>
            </div>
          </Form>
        )}
      />
    );
  }
}

export default graphql(CREATE_ROLE, {
  options: {
    update: (cache, { data: { createRole } }) => {
      const { roles } = cache.readQuery({ query: GET_ROLES });
      cache.writeQuery({
        query: GET_ROLES,
        data: { invitations: [...roles, createRole] },
      });
    },
  },
})(RoleModal);
