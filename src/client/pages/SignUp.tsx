import { ApolloError } from 'apollo-client';
import gql from 'graphql-tag';
import * as React from 'react';
import { Mutation } from 'react-apollo';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { User } from '../../types';
import {
  Button, Container, Form, Header,
} from '../components';
import { InputChangeHandlerType } from '../components/Form/Input';
import handleGraphQLError from '../errors/handleGraphQLError';
import withServerContext from '../HOC/withServerContext';

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
  },
};

class SignUp extends React.Component<SignUpPageProps> {
  private static handleError(error: ApolloError) {
    const { errorMessage } = handleGraphQLError(error, false);

    window.UIkit.notification({
      message: errorMessage,
      pos: 'top-right',
      status: 'danger',
      timeout: 5000,
    });
  }

  public readonly state: Readonly<SignUpPageState>;

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

  public render() {
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
                    <Form
                      loading={loading || !!data}
                      onSubmit={(e) => {
                      e.preventDefault();

                      register({
                        variables: {
                          input: {
                            code,
                            email,
                            firstName,
                            lastName,
                            username,
                          },
                        },
                      });
                    }}
                    >
                      <Form.Fieldset layout='stacked'>
                        <div className='uk-margin'>
                          <Form.Input
                            error={validationErrors ? validationErrors.username : null}
                            label='USERNAME'
                            name='username'
                            onChange={this.handleChange}
                            required={true}
                            value={username}
                          />
                        </div>
                        <div className='uk-margin'>
                          <Form.Input
                            disabled={true}
                            error={validationErrors ? validationErrors.email : null}
                            label='EMAIL'
                            name='email'
                            onChange={this.handleChange}
                            required={true}
                            value={email}
                          />
                        </div>
                        <div className='uk-margin'>
                          <Form.Input
                            label='FIRST NAME'
                            name='firstName'
                            onChange={this.handleChange}
                            value={firstName}
                          />
                        </div>
                        <div className='uk-margin'>
                          <Form.Input
                            label='LAST NAME'
                            name='lastName'
                            onChange={this.handleChange}
                            value={lastName}
                          />
                        </div>
                        <div className='uk-margin'>
                          <Form.Input
                            error={validationErrors ? validationErrors.code : null}
                            label='INVITATION CODE'
                            name='code'
                            onChange={this.handleChange}
                            required={true}
                            value={code}
                          />
                        </div>
                      </Form.Fieldset>
                      <Button className='uk-width-1-1' variation='primary' type='submit'>Submit</Button>
                    </Form>
                  </Container>
                </div>
              </React.Fragment>
            );
          }}
      </Mutation>
    );
  }

  private handleChange: InputChangeHandlerType = (e, { name, value }) => this.setState({ [name]: value });

  private handleSuccess = () => {
    this.props.history.push('/activate');
  }
}

export default withServerContext(withRouter(SignUp));
