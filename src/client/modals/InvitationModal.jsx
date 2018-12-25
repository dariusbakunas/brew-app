import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import Form from '../components/Form';
import handleGrpahQLError from '../errors/handleGraphQLError';
import { CREATE_INVITATION, GET_ALL_INVITATIONS } from '../queries';
import Modal from './Modal';

class InvitationModal extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    mutate: PropTypes.func.isRequired,
  };

  state = {
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

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = (e, closeModal) => {
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
    const { email, loading, send } = this.state;

    return (
      <Modal
        id={id} label='New Invitation'
        loading={loading}
        error={this.state.error}
        onHide={this.handleHide}
        render={close => (
          <Form onSubmit={e => this.handleSubmit(e, close)}>
            <Form.Fieldset>
              <Form.Input
                disabled={loading}
                error={this.state.validationErrors ? this.state.validationErrors.email : null}
                label='Email'
                name='email'
                value={email}
                onChange={this.handleChange}
                required
              />
              <Form.Checkbox
                disabled={loading}
                label='Send invitation email'
                name='send'
                checked={send}
                onChange={this.handleChange}
              />
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

export default graphql(CREATE_INVITATION, {
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
