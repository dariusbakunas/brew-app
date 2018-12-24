import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import Form from '../components/Form';
import Header from '../components/Header';
import LoadingBar from '../components/LoadingBar';
import handleGrpahQLError from '../errors/handleGraphQLError';
import { CREATE_INVITATION, GET_ALL_INVITATIONS } from '../queries';

class InvitationModal extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

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

  componentDidMount() {
    this.ref.current.addEventListener('hidden', this.handleHide);
  }

  componentWillUnmount() {
    this.ref.current.removeEventListener('hidden', this.handleHide);
  }

  close = () => {
    window.UIkit.modal(this.ref.current).hide();
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = (e) => {
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
          this.close();
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
      <div id={id} data-uk-modal ref={this.ref}>
        <div className='uk-modal-dialog uk-modal-body'>
          <button className='uk-modal-close-default' type='button' data-uk-close/>
          <Header as='h2' className='uk-modal-title'>New Invitation</Header>
          <LoadingBar active={loading}/>
          {
            this.state.error &&
            <span className='uk-text-danger'>{this.state.error}</span>
          }
          <Form onSubmit={this.handleSubmit}>
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
        </div>
      </div>
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
