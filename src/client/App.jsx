import React from 'react';
import { Route } from 'react-router-dom';
import Learn from './pages/Learn';
import Dashboard from './pages/Dashboard';

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Route path='/' exact component={Dashboard}/>
      </React.Fragment>
    );
  }
}

export default App;
