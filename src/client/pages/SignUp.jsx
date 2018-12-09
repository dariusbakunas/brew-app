import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Form, Grid, Segment, Message,
} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Redirect, withRouter } from 'react-router-dom';
import withServerContext from '../HOC/withServerContext';
import { USER_STATUS } from '../../contants';

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
      firstName,
      lastName,
      username: '',
    };
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSuccess = () => {
    window.location.href = '/auth';
  };

  parseErrorMessage = (error) => {
    const { graphQLErrors, networkError } = error;

    const unknownError = {
      header: 'Unknown Error',
      message: 'Unkown error occurred, please try again.',
      fields: {},
    };

    if (networkError) {
      return unknownError;
    }

    if (graphQLErrors.length && graphQLErrors[0].extensions && graphQLErrors[0].extensions.code === 'BAD_USER_INPUT') {
      const { exception } = graphQLErrors[0].extensions;

      return {
        header: graphQLErrors[0].message,
        fields: exception.fields,
      };
    }

    return unknownError;
  };

  render() {
    if (this.props.user.status !== 'GUEST') {
      return (
        <Redirect to='/'/>
      );
    }

    return (
      <div className='signup-container'>
        <Grid centered style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Mutation mutation={REGISTER} onCompleted={this.handleSuccess}>
              {
                (register, { data, loading, error }) => {
                  const parsedError = error ? this.parseErrorMessage(error) : null;

                  return (
                    <Segment raised>
                      <Message
                        header='Welcome!'
                        content='Fill out the form below to sign-up for a new account'
                      />
                      <Form className='fluid signup-form' loading={loading} error={!!error} success={!!data} onSubmit={(e) => {
                        e.preventDefault();

                        const {
                          username, email, firstName, lastName, code,
                        } = this.state;

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
                        <Form.Input
                          fluid
                          error={ parsedError ? !!parsedError.fields.username : null }
                          icon='user'
                          iconPosition='left'
                          name='username'
                          placeholder='Username'
                          required
                          value={this.state.username}
                          onChange={this.handleChange}
                        />
                        <Form.Input
                          fluid icon='at'
                          error={ parsedError ? !!parsedError.fields.email : null }
                          iconPosition='left'
                          name='email'
                          placeholder='E-mail address'
                          value={this.state.email}
                          readOnly
                          disabled
                          onChange={this.handleChange}
                        />
                        <Form.Input
                          fluid
                          name='firstName'
                          placeholder='First Name'
                          value={this.state.firstName}
                          onChange={this.handleChange}
                        />
                        <Form.Input
                          fluid
                          name='lastName'
                          placeholder='Last Name'
                          value={this.state.lastName}
                          onChange={this.handleChange}/>
                        <Form.Input
                          fluid
                          error={ parsedError ? !!parsedError.fields.code : null }
                          name='code'
                          placeholder='Invitation Code'
                          value={this.state.code}
                          required
                          onChange={this.handleChange}/>
                        <Message
                          success
                          header='Registration Successful'
                          content='Redirecting to Dashboard' />
                        {
                          parsedError &&
                          <Message
                            error
                            header={parsedError.header}
                            content={parsedError.message}
                            list={Object.keys(parsedError.fields).map(key => parsedError.fields[key])}
                          />
                        }
                        <Form.Field>
                          <Button fluid size='large' primary type='submit'>
                            Submit
                          </Button>
                        </Form.Field>
                        <Form.Field>
                          <Button fluid size='large' onClick={(e) => {
                            e.preventDefault();
                            this.props.history.push('/login');
                          }}>
                            Cancel
                          </Button>
                        </Form.Field>
                      </Form>
                    </Segment>
                  );
                }
              }
            </Mutation>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default withRouter(withServerContext(SignUp));
