import React from 'react';
import { compose } from 'react-apollo';
import { UserRole } from '../../types';
import { Form } from '../components';
import { InputChangeHandlerType } from '../components/Form/Input';
import handleGrpahQLError from '../errors/handleGraphQLError';
import { createRoleMutation } from '../HOC/roles';
import Modal from './Modal';

interface IRoleModalProps {
  id: string;
  createRole: (args: { variables: UserRole }) => Promise<any>;
}

type RoleModalState = UserRole & {
  error: string,
  loading: boolean,
  validationErrors: {
    [key: string]: string,
  },
};

export class RoleModal extends React.Component<IRoleModalProps> {
  public readonly state: Readonly<RoleModalState> = {
    code: '',
    error: null,
    loading: false,
    name: '',
    validationErrors: null,
  };

  public render() {
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
        render={(close) => (
          <Form onSubmit={(e) => this.handleSubmit(e, close)}>
            <Form.Fieldset>
              <div className='uk-margin'>
                <Form.Input
                  disabled={loading}
                  error={validationErrors ? validationErrors.email : null}
                  label='Name'
                  name='name'
                  value={name}
                  onChange={this.handleChange}
                  required={true}
                />
              </div>
              <div className='uk-margin'>
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
              <button
                className='uk-button uk-button-default uk-modal-close uk-margin-small-right'
                type='button'
                disabled={loading}>
                Cancel
              </button>
              <button
                className='uk-button uk-button-primary'
                type='submit'
                disabled={loading}>
                Submit
              </button>
            </div>
          </Form>
        )}
      />
    );
  }

  private handleChange: InputChangeHandlerType = (e, { name, value }) => this.setState({ [name]: value });

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>, closeModal: () => void) => {
    e.preventDefault();

    const { createRole } = this.props;

    this.setState({ loading: true }, () => {
      createRole({
        variables: {
          code: this.state.code,
          name: this.state.name,
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
  }

  private handleHide = () => {
    this.setState({
      code: '',
      error: null,
      name: '',
      send: true,
      validationErrors: null,
    });
  }
}

export default compose(
  createRoleMutation,
)(RoleModal);
