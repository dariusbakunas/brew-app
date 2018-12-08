import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Form, Grid, Header, Segment, Message,
} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Redirect } from 'react-router-dom';
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

  onInputChange = (key, e) => {
    this.setState(({
      [key]: e.target.value,
    }));
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
            <Mutation mutation={REGISTER}>
              {
                (register, { data, loading, error }) => {
                  const parsedError = error ? this.parseErrorMessage(error) : null;

                  return (
                    <Form size='large' className='signup-form' loading={loading} error={!!error} onSubmit={(e) => {
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
                      <Segment raised>
                        <Header as='h2' textAlign='center'>
                          REGISTER
                        </Header>
                        <Form.Input
                          fluid
                          error={ parsedError ? !!parsedError.fields.username : null }
                          icon='user'
                          iconPosition='left'
                          placeholder='Username'
                          required
                          value={this.state.username}
                          onChange={this.onInputChange.bind(this, 'username')}
                        />
                        <Form.Input
                          fluid icon='at'
                          error={ parsedError ? !!parsedError.fields.email : null }
                          iconPosition='left'
                          placeholder='E-mail address'
                          value={this.state.email}
                          readOnly
                          disabled
                          onChange={this.onInputChange.bind(this, 'email')}
                        />
                        <Form.Input fluid placeholder='First Name' value={this.state.firstName} onChange={this.onInputChange.bind(this, 'firstName')}/>
                        <Form.Input fluid placeholder='Last Name' value={this.state.lastName} onChange={this.onInputChange.bind(this, 'lastName')}/>
                        <Form.Input fluid placeholder='Invitation Code' value={this.state.code} onChange={this.onInputChange.bind(this, 'code')}/>
                        {
                          parsedError &&
                          <Message
                            error
                            header={parsedError.header}
                            content={parsedError.message}
                            list={Object.keys(parsedError.fields).map(key => parsedError.fields[key])}
                          />
                        }
                        <Button fluid size='large'>
                          Submit
                        </Button>
                      </Segment>
                    </Form>
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

export default withServerContext(SignUp);
