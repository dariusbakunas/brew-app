import React from 'react';
import { graphql } from 'react-apollo';
import { Form } from '../components';
import handleGrpahQLError from '../errors/handleGraphQLError';
import { CREATE_INVITATION, GET_ALL_INVITATIONS } from '../queries';
import Modal from './Modal';
import { InvitationInput } from '../../types';
import { InputChangeHandlerType } from '../components/Form/Input';

type InvitationModalProps = {
  id: string,
  mutate?: (args: { variables: InvitationInput }) => Promise<any>,
};

type InvitationModalState = {
  email: string,
  error?: string,
  loading: boolean,
  send: boolean,
  validationErrors: {
    [key: string]: string,
  }
};

class InvitationModal extends React.Component<InvitationModalProps> {
  readonly state: Readonly<InvitationModalState> = {
    email: '',
    error: null,
    loading: false,
    send: true,
    validationErrors: null,
  };

  handleHide = () => {
    this.setState({
      email: '',
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
          email: this.state.email,
          sendEmail: this.state.send,
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
      email, error, loading, send, validationErrors,
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
                  label='Email'
                  name='email'
                  value={email}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="uk-margin">
                <Form.Checkbox
                  disabled={loading}
                  label='Send invitation email'
                  name='send'
                  checked={send}
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

export default graphql<InvitationModalProps>(CREATE_INVITATION, {
  options: {
    update: (cache, { data: { createInvitation } }) => {
      const { invitations } = cache.readQuery({ query: GET_ALL_INVITATIONS });
      cache.writeQuery({
        query: GET_ALL_INVITATIONS,
        data: { invitations: [...invitations, createInvitation] },
      });
    },
  },
})(InvitationModal);
