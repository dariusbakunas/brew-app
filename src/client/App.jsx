import React from 'react';
import gql from 'graphql-tag';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { Transition } from 'semantic-ui-react';
import Learn from './pages/Learn';
import Dashboard from './pages/Dashboard';
import withServerContext from './HOC/withServerContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { USER_STATUS } from '../contants';

const GET_LOGIN_QUOTE = gql`
  {
    randomQuote {
      text
      author
    }
  }
`;

class App extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      email: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      status: PropTypes.oneOf(Object.values(USER_STATUS)),
    }),
  };

  render() {
    if (!this.props.user) {
      return (
        <Query query={GET_LOGIN_QUOTE}>
          {
            ({ loading, data, error }) => {
              if (error) { return 'Error'; }

              return (
                <Transition visible={!loading} animation='scale' duration={500}>
                  <Login quote={data.randomQuote}/>
                </Transition>
              );
            }
          }
        </Query>
      );
    }

    if (this.props.user.status === USER_STATUS.GUEST) {
      const { firstName, lastName, email } = this.props.user;

      return (
        <SignUp email={email} firstName={firstName} lastName={lastName}/>
      );
    }

    if (this.props.user.status === USER_STATUS.NEW) {
      return (
        <div>Looks like your account is not activated yet, comback later</div>
      );
    }

    if (this.props.user.status === USER_STATUS.INACTIVE) {
      return (
        <div>Looks like your account was deactivated, comback later</div>
      );
    }

    return (
      <React.Fragment>
        <Route path='/' exact component={Dashboard}/>
        <Route path='/learn' component={Learn}/>
      </React.Fragment>
    );
  }
}

export default withServerContext(App);
