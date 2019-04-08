import React from 'react';
import {
  Route, RouteComponentProps, Switch, withRouter,
} from 'react-router-dom';
import Main from './pages/MainPage';
import withServerContext from './HOC/withServerContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ErrorBoundary from './errors/ErrorBoundary';
import Privacy from './pages/PrivacyPage';
import Terms from './pages/Terms';
import Activate from './pages/Activate';
import Footer from './components/Footer';
import { UserStatus } from '../types';

type AppProps = RouteComponentProps<any> & {
  location: {
    pathname: string,
  },
  user: {
    email: string,
    firstName: string,
    lastName: string,
    status: UserStatus,
  },
};

class App extends React.Component<AppProps> {
  render() {
    return (
      <ErrorBoundary>
        <Switch>
          <Route path='/login' component={Login}/>
          <Route path='/register' component={SignUp}/>
          <Route path='/activate' component={Activate}/>
          <Route path='/privacy' component={Privacy}/>
          <Route path='/terms' component={Terms}/>
          <Route path='/' component={Main}/>
        </Switch>
        <Footer/>
      </ErrorBoundary>
    );
  }
}

export default withServerContext(withRouter(App));
