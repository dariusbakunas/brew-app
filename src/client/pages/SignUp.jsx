import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Redirect, withRouter } from 'react-router-dom';
import Form from '../components/Form';
import withServerContext from '../HOC/withServerContext';
import { USER_STATUS } from '../../contants';
import Card from '../components/Card';
import Button from '../components/Button';
import Header from '../components/Header';
import Container from '../components/Container';
import { ServerError, AuthorizationError } from '../errors/errors';

const REGISTER = gql`
  mutation Register($input: RegistrationInput!) {
    register(input: $input) {
      id
      status
    }
  }
`;

class SignUp extends React.Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
    user: PropTypes.shape({
      email: PropTypes.string.isRequired,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      status: PropTypes.oneOf(Object.values(USER_STATUS)),
    }).isRequired,
  };

  constructor(props) {
    super(props);

    const { email, firstName, lastName } = props.user;

    this.state = {
      code: '',
      email,
      error: null,
      firstName,
      lastName,
      username: '',
    };
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSuccess = () => {
    window.location.href = '/auth';
  };

  handleError = (error) => {
    const { graphQLErrors, networkError } = error;

    if (networkError) {
      throw new ServerError(networkError);
    }

    let validationErrors = {};
    const errorMessages = [];

    if (graphQLErrors) {
      graphQLErrors.forEach((err) => {
        const { extensions } = err;

        if (extensions.code === 'INTERNAL_SERVER_ERROR') {
          throw new ServerError(err.message);
        }

        errorMessages.push(err.message);

        if (extensions.code === 'BAD_USER_INPUT') {
          // merge validation errors for now
          validationErrors = {
            ...validationErrors,
            ...extensions.exception.validationErrors,
          };
        }
      });
    }

    if (errorMessages.length) {
      errorMessages.forEach((message) => {
        window.UIkit.notification({
          message,
          status: 'danger',
          pos: 'top-center',
          timeout: 5000,
        });
      });
    }

    if (Object.keys(validationErrors).length) {
      this.setState({
        error: {
          validationErrors,
        },
      });
    }
  };

  render() {
    if (this.props.user.status !== 'GUEST') {
      return (
        <Redirect to='/'/>
      );
    }

    return (
      <Mutation mutation={REGISTER} onCompleted={this.handleSuccess} onError={this.handleError}>
        {
          (register, { data, loading }) => {
            const {
              username, error, email, firstName, lastName, code,
            } = this.state;

            return (
              <React.Fragment>
                <div className='signup-container'>
                  <Container className='uk-width-large'>
                    <Header as='h2' textAlign='center'>NEW ACCOUNT</Header>
                    <Form loading={loading} onSubmit={(e) => {
                      e.preventDefault();

                      register({
                        variables: {
                          input: {
                            username,
                            email,
                            firstName,
                            lastName,
                            code,
                          },
                        },
                      });
                    }}>
                      <Form.Fieldset>
                        <Form.Input
                          error={ error ? error.validationErrors.username : null }
                          label='USERNAME'
                          name='username'
                          onChange={this.handleChange}
                          required
                          value={username}/>
                        <Form.Input
                          error={ error ? error.validationErrors.email : null }
                          label='EMAIL'
                          name='email'
                          onChange={this.handleChange}
                          required
                          disabled
                          value={email}/>
                        <Form.Input
                          label='FIRST NAME'
                          name='firstName'
                          onChange={this.handleChange}
                          value={firstName}/>
                        <Form.Input
                          label='LAST NAME'
                          name='lastName'
                          onChange={this.handleChange}
                          value={lastName}/>
                        <Form.Input
                          label='INVITATION CODE'
                          error={ error ? error.validationErrors.code : null }
                          name='code'
                          onChange={this.handleChange}
                          required
                          value={code}/>
                      </Form.Fieldset>
                      <Button className='uk-width-1-1' variation='primary'>Submit</Button>
                    </Form>
                  </Container>
                </div>
              </React.Fragment>
            );
          }
        }
      </Mutation>
    );
  }
}

export default withRouter(withServerContext(SignUp));
