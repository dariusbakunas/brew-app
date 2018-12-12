import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import withServerContext from './HOC/withServerContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { USER_STATUS } from '../contants';
import ErrorBoundary from './errors/errorBoundary';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

class App extends React.Component {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
    user: PropTypes.shape({
      email: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      status: PropTypes.oneOf(Object.values(USER_STATUS)),
    }),
  };

  render() {
    //
    // if (this.props.user.status === USER_STATUS.NEW) {
    //   return (
    //     <div>Looks like your account is not activated yet, comback later</div>
    //   );
    // }
    //
    // if (this.props.user.status === USER_STATUS.INACTIVE) {
    //   return (
    //     <div>Looks like your account was deactivated, comback later</div>
    //   );
    // }

    return (
      <ErrorBoundary>
        <Route path='/' exact component={Dashboard}/>
        <Route path='/login' component={Login}/>
        <Route path='/register' component={SignUp}/>
        <Route path='/privacy' component={Privacy}/>
        <Route path='/terms' component={Terms}/>
      </ErrorBoundary>
    );
  }
}

export default withRouter(withServerContext(App));
