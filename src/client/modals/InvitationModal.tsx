import React from 'react';
import { graphql } from 'react-apollo';
import { InvitationInput } from '../../../types';
import { Form } from '../../../components';
import { InputChangeHandlerType } from '../../../components/Form/Input';
import handleGrpahQLError from '../../../errors/handleGraphQLError';
import { CREATE_INVITATION, GET_ALL_INVITATIONS } from '../../../queries';
import Modal from './Modal';

interface IInvitationModalProps {
  id: string;
  onHide: () => void;
  open: boolean;
  createInvitation?: (args: { variables: InvitationInput }) => Promise<any>;
}

interface IInvitationModalState {
  email: string;
  error?: string;
  loading: boolean;
  send: boolean;
  validationErrors: {
    [key: string]: string,
  };
}

class InvitationModal extends React.Component<IInvitationModalProps> {
  public readonly state: Readonly<IInvitationModalState> = {
    email: '',
    error: null,
    loading: false,
    send: true,
    validationErrors: null,
  };

  public render() {
    const { id, open } = this.props;
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
        open={open}
        render={(close) => (
          <Form onSubmit={(e) => this.handleSubmit(e, close)}>
            <Form.Fieldset>
              <div className='uk-margin'>
                <Form.Input
                  disabled={loading}
                  error={validationErrors ? validationErrors.email : null}
                  label='Email'
                  name='email'
                  value={email}
                  onChange={this.handleChange}
                  required={true}
                />
              </div>
              <div className='uk-margin'>
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
              <button
                className='uk-button uk-button-default uk-modal-close uk-margin-small-right'
                type='button'
                disabled={loading}>
                Cancel
              </button>
              <button className='uk-button uk-button-primary' type='submit' disabled={loading}>Submit</button>
            </div>
          </Form>
        )}
      />
    );
  }

  private handleHide = () => {
    if (this.props.onHide) {
      this.props.onHide();
    }

    this.setState({
      email: '',
      error: null,
      send: true,
      validationErrors: null,
    });
  }

  private handleChange: InputChangeHandlerType = (e, { name, value }) => this.setState({ [name]: value });

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>, closeModal: () => void) => {
    e.preventDefault();

    const { createInvitation } = this.props;

    this.setState({ loading: true }, () => {
      createInvitation({
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
  }
}

export default graphql<IInvitationModalProps>(CREATE_INVITATION, {
  name: 'createInvitation',
  options: {
    update: (cache, { data: { createInvitation } }) => {
      const { invitations } = cache.readQuery({ query: GET_ALL_INVITATIONS });
      cache.writeQuery({
        data: { invitations: [...invitations, createInvitation] },
        query: GET_ALL_INVITATIONS,
      });
    },
  },
})(InvitationModal);
