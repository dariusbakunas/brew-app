import { ApolloClient, ApolloError } from 'apollo-client';
import gql from 'graphql-tag';
import queryString from 'query-string';
import React from 'react';
import { ExecutionResult, withApollo } from 'react-apollo';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Button, Container, Header } from '../components';
import handleGraphQLError from '../errors/handleGraphQLError';

const ACTIVATE_USER = gql`
  mutation ActivateUser($token: String!) {
    activateUser(token: $token) {
      success
    }
  }
`;

interface IWindow {
  UIkit?: any;
  location: {
    href: string,
  };
}

declare var window: IWindow;

interface IActivateProps {
  client: ApolloClient<any>;
}

interface IResult { activateUser: { success: boolean }; }

class Activate extends React.Component<IActivateProps & RouteComponentProps<any>> {
  private static handleError(error: ApolloError) {
    const { errorMessage } = handleGraphQLError(error, false);

    if (errorMessage) {
      window.UIkit.notification({
        errorMessage,
        pos: 'top-right',
        status: 'danger',
        timeout: 5000,
      });
    }
  }

  public readonly state: { loading: boolean, success: boolean, error: boolean };

  constructor(props: IActivateProps & RouteComponentProps<any>) {
    super(props);
    this.state = {
      error: false,
      loading: true,
      success: false,
    };
  }

  public componentDidMount() {
    const { location } = this.props;
    const { token } = queryString.parse(location.search);

    if (token) {
      this.props.client.mutate<IResult>({
        mutation: ACTIVATE_USER,
        variables: { token },
      })
        .then((response) => this.handleComplete(response))
        .catch(Activate.handleError);
    }
  }

  public render() {
    const { location } = this.props;
    const { token } = queryString.parse(location.search);

    if (!token) {
      return (
        <div className='signup-container'>
          <Container className='uk-width-large uk-text-center'>
            <Header>Almost There</Header>
            <p>We&#39;ve sent you email with an activation link.
              Simply click the link and your account will be activated</p>
          </Container>
        </div>
      );
    }

    if (this.state.loading) {
      return (
        <div className='signup-container'>
          <Container className='uk-width-large uk-text-center'>
            <div data-uk-spinner='ratio: 2'/>
          </Container>
        </div>
      );
    }

    if (this.state.error) {
      return (
        <div className='signup-container'>
          <Container className='uk-width-large uk-text-center'>
            <Header>Oops!</Header>
            <p>Looks like token is invalid or expired</p>
          </Container>
        </div>
      );
    }

    return (
        <div className='signup-container'>
          <Container className='uk-width-large uk-text-center'>
            <Header>Activation Complete</Header>
            <p>Your account is now activated, go ahead and log in</p>
            <div>
              <Button variation='primary' onClick={this.handleLogin}>Login</Button>
            </div>
          </Container>
        </div>
    );
  }

  private handleComplete = (result: ExecutionResult<IResult>) => {
    const { success } = result.data.activateUser;

    if (success) {
      this.setState({
        error: false,
        loading: false,
        success: true,
      });
    } else {
      this.setState({
        error: true,
        loading: false,
      });
    }
  }

  private handleLogin = () => {
    window.location.href = '/auth';
  }
}

export default withApollo(withRouter(Activate));
