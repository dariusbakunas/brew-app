import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import gql from 'graphql-tag';
import { withApollo, graphql } from 'react-apollo';
import Header from '../components/Header/Header';
import Container from '../components/Container/Container';

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
      loading: false,
    };
  }

  handleComplete = (data) => {
    const { success } = data.activateUser;

    if (success) {
      window.location.href = '/auth';
    } else {
      this.setState({
        loading: false,
        error: true,
      });
    }
  };

  handleError = (data) => {
    this.setState({ loading: false });
  };

  componentDidMount() {
    const { location } = this.props;
    const { token } = queryString.parse(location.search);

    this.setState({ loading: true }, () => {
      this.props.client.mutate({
        variables: { token },
        mutation: ACTIVATE_USER,
      })
        .then(response => this.handleComplete(response.data))
        .catch(this.handleError);
    });
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
          Redirecting, please wait..
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
