import * as React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { ApolloError } from 'apollo-client';
import {
  Button, Container, Form, Header,
} from '../components';
import withServerContext from '../HOC/withServerContext';
import { User } from '../../types';
import { InputChangeHandlerType } from '../components/Form/Input';
import handleGraphQLError from '../errors/handleGraphQLError';

const REGISTER = gql`
  mutation Register($input: RegistrationInput!) {
    register(input: $input) {
      id
      status
    }
  }
`;

type SignUpPageProps = RouteComponentProps<any> & {
  user: Partial<User>,
};

type SignUpPageState = Partial<User> & {
  error: string,
  code: string,
  validationErrors?: {
    [key: string]: string,
  }
};

class SignUp extends React.Component<SignUpPageProps> {
  readonly state: Readonly<SignUpPageState>;

  constructor(props: SignUpPageProps) {
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

  handleChange: InputChangeHandlerType = (e, { name, value }) => this.setState({ [name]: value });

  handleSuccess = () => {
    this.props.history.push('/activate');
  };

  private static handleError(error: ApolloError) {
    const { errorMessage } = handleGraphQLError(error, false);

    window.UIkit.notification({
      message: errorMessage,
      status: 'danger',
      pos: 'top-right',
      timeout: 5000,
    });
  }

  render() {
    if (this.props.user.status !== 'GUEST') {
      return (
        <Redirect to='/'/>
      );
    }

    return (
      <Mutation mutation={REGISTER} onCompleted={this.handleSuccess} onError={SignUp.handleError}>
        {
          (register, { data, loading }) => {
            const {
              username, error, email, firstName, lastName, code, validationErrors,
            } = this.state;

            return (
              <React.Fragment>
                <div className='signup-container'>
                  <Container className='uk-width-large'>
                    <Header as='h2' textAlign='center'>NEW ACCOUNT</Header>
                    <Form loading={loading || !!data} onSubmit={(e) => {
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
                      <Form.Fieldset layout='stacked'>
                        <div className="uk-margin">
                          <Form.Input
                            error={ validationErrors.username }
                            label='USERNAME'
                            name='username'
                            onChange={this.handleChange}
                            required
                            value={username}/>
                        </div>
                        <div className="uk-margin">
                          <Form.Input
                            error={ validationErrors.email }
                            label='EMAIL'
                            name='email'
                            onChange={this.handleChange}
                            required
                            disabled
                            value={email}/>
                        </div>
                        <div className="uk-margin">
                          <Form.Input
                            label='FIRST NAME'
                            name='firstName'
                            onChange={this.handleChange}
                            value={firstName}/>
                        </div>
                        <div className="uk-margin">
                          <Form.Input
                            label='LAST NAME'
                            name='lastName'
                            onChange={this.handleChange}
                            value={lastName}/>
                        </div>
                        <div className="uk-margin">
                          <Form.Input
                            label='INVITATION CODE'
                            error={ validationErrors.code }
                            name='code'
                            onChange={this.handleChange}
                            required
                            value={code}/>
                        </div>
                      </Form.Fieldset>
                      <Button className='uk-width-1-1' variation='primary' type='submit'>Submit</Button>
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

export default withServerContext(withRouter(SignUp));
