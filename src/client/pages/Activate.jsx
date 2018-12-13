import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import gql from 'graphql-tag';
import { withApollo, graphql } from 'react-apollo';
import Header from '../components/Header/Header';
import Container from '../components/Container/Container';
import Button from '../components/Button/Button';

const ACTIVATE_USER = gql`
  mutation ActivateUser($token: String!) {
    activateUser(token: $token) {
      success
    }
  }
`;

class Activate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  handleComplete = (data) => {
    const { success } = data.activateUser;

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

  componentDidMount() {
    const { location } = this.props;
    const { token } = queryString.parse(location.search);

    this.props.client.mutate({
      variables: { token },
      mutation: ACTIVATE_USER,
    })
      .then(response => this.handleComplete(response.data))
      .catch(this.handleError);
  }

  render() {
    const { location } = this.props;
    const { token } = queryString.parse(location.search);

    if (!token) {
      return (
        <div className='signup-container'>
          <Container className='uk-width-large uk-text-center'>
            <Header>Almost There</Header>
            <p>We&#39;ve sent you email with an activation link. Simply click the link and your account will be activated</p>
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

Activate.propTypes = {
  client: PropTypes.object,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

export default withApollo(withRouter(Activate));
