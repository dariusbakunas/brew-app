import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter, Switch } from 'react-router-dom';
import Main from './pages/Main';
import withServerContext from './HOC/withServerContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { USER_STATUS } from '../contants';
import ErrorBoundary from './errors/ErrorBoundary';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Activate from './pages/Activate';
import Footer from './components/Footer';

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
    return (
      <ErrorBoundary>
        <div className='main-container'>
          <Switch>
            <Route path='/login' component={Login}/>
            <Route path='/register' component={SignUp}/>
            <Route path='/activate' component={Activate}/>
            <Route path='/privacy' component={Privacy}/>
            <Route path='/terms' component={Terms}/>
            <Route path='/' component={Main}/>
          </Switch>
          <Footer/>
        </div>
      </ErrorBoundary>
    );
  }
}

export default withRouter(withServerContext(App));
