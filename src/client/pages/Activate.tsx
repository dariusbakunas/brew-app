import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ApolloClient, ApolloError } from 'apollo-client';
import queryString from 'query-string';
import gql from 'graphql-tag';
import { ExecutionResult, withApollo } from 'react-apollo';
import { Header, Container, Button } from '../components';
import handleGraphQLError from '../errors/handleGraphQLError';

const ACTIVATE_USER = gql`
  mutation ActivateUser($token: String!) {
    activateUser(token: $token) {
      success
    }
  }
`;

type ActivateProps = {
  client: ApolloClient<any>,
};

type Result = { activateUser: { success: boolean }};

class Activate extends React.Component<ActivateProps & RouteComponentProps<any>> {
  readonly state: { loading: boolean, success: boolean, error: boolean };

  constructor(props: ActivateProps & RouteComponentProps<any>) {
    super(props);
    this.state = {
      loading: true,
      success: false,
      error: false,
    };
  }

  handleComplete = (result: ExecutionResult<Result>) => {
    const { success } = result.data.activateUser;

    if (success) {
      this.setState({
        loading: false,
        success: true,
        error: false,
      });
    } else {
      this.setState({
        loading: false,
        error: true,
      });
    }
  };

  handleLogin = () => {
    window.location.href = '/auth';
  };

  private static handleError(error: ApolloError) {
    const { errorMessage } = handleGraphQLError(error, false);

    if (errorMessage) {
      window.UIkit.notification({
        errorMessage,
        status: 'danger',
        pos: 'top-right',
        timeout: 5000,
      });
    }
  }

  componentDidMount() {
    const { location } = this.props;
    const { token } = queryString.parse(location.search);

    if (token) {
      this.props.client.mutate<Result>({
        variables: { token },
        mutation: ACTIVATE_USER,
      })
        .then(response => this.handleComplete(response))
        .catch(Activate.handleError);
    }
  }

  render() {
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
            <div data-uk-spinner="ratio: 2"/>
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
}

export default withApollo(withRouter(Activate));
