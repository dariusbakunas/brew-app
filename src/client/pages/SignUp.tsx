import { ApolloError } from 'apollo-client';
import React from 'react';
import { compose } from 'react-apollo';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { User } from '../../types';
import {
  Button, Container, Form, Header,
} from '../components';
import { InputChangeHandlerType } from '../components/Form/Input';
import handleGraphQLError from '../errors/handleGraphQLError';
import { IRegisterInput, signUp } from '../HOC/signup';
import withServerContext from '../HOC/withServerContext';

interface IWindow {
  UIkit?: any;
}

declare var window: IWindow;

type SignUpPageProps = RouteComponentProps<any> & {
  user: Partial<User>,
  register: (args: { variables: IRegisterInput }) => Promise<void>;
};

type SignUpPageState = Partial<User> & {
  error: string,
  loading: boolean,
  code: string,
  validationErrors?: {
    [key: string]: string,
  },
};

class SignUp extends React.Component<SignUpPageProps> {
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
      loading: false,
      username: '',
    };
  }

  public render() {
    if (this.props.user.status !== 'GUEST') {
      return (
        <Redirect to='/'/>
      );
    }

    const {
      username, email, firstName, lastName, loading, code, validationErrors,
    } = this.state;

    return (
      <React.Fragment>
        <div className='signup-container'>
          <Container className='uk-width-large'>
            <Header as='h2' textAlign='center'>NEW ACCOUNT</Header>
            <Form
              loading={loading}
              onSubmit={(e) => {
                e.preventDefault();

                this.handleRegister({
                  input: {
                    code,
                    email,
                    firstName,
                    lastName,
                    username,
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
  }

  private handleError = (error: ApolloError) => {
    const { validationErrors, errorMessage } = handleGraphQLError(error, false);

    this.setState({
      error: errorMessage,
      loading: false,
      validationErrors,
    });

    window.UIkit.notification({
      message: errorMessage,
      pos: 'top-right',
      status: 'danger',
      timeout: 5000,
    });
  }

  private handleRegister: (arg: IRegisterInput) => void = (input) => {
    const { register } = this.props;

    this.setState({ loading: true }, () => {
      register({
        variables: input,
      }).then(() => {
        this.setState({ loading: false }, () => {
          this.props.history.push('/activate');
        });
      }).catch(this.handleError);
    });
  }

  private handleChange: InputChangeHandlerType = (e, { name, value }) => this.setState({ [name]: value });
}

export default compose(
  signUp,
)(withServerContext(withRouter(SignUp)));
