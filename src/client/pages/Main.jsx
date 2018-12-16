import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import withServerContext from '../HOC/withServerContext';
import { USER_STATUS } from '../../contants';
import Navbar from '../components/Navbar';
import SideMenu from '../components/SideMenu';
import Nav from '../components/Nav';
import Account from './Account';
import Dashboard from './Dashboard';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSideBar: false,
    };
  }

  showSideBar = () => {
    this.setState({ showSideBar: true });
  };

  hideSideBar = () => {
    this.setState({ showSideBar: false });
  };

  static propTypes = {
    user: PropTypes.shape({
      email: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      status: PropTypes.oneOf(Object.values(USER_STATUS)),
    }),
  };

  render() {
    return (
      <React.Fragment>
        <Navbar toggleTarget='side-menu' transparent/>
        <SideMenu
          id='side-menu'
          overlay={true}
          mode='push'
          visible={this.state.showSideBar}
          onShow={this.showSideBar}
          onHide={this.hideSideBar}>
            <Nav>
              <Nav.Header label='Brew'/>
              <Nav.Item label='Dashboard' url='/'/>
              <Nav.Item label='Inventory' url='/inventory'/>
              <Nav.Item label='Recipes' url='/recipes'/>
              <Nav.Item label='Sessions' url='/sessions'/>
              <Nav.Item label='Tools' url='/tools'/>
              <Nav.Header label='Account'/>
              <Nav.Item label='Settings & Profile' url='/account'/>
              <Nav.Item as='a' label='Logout' url='/logout'/>
            </Nav>
        </SideMenu>
        <Route path='/' exact component={Dashboard}/>
        <Route path='/account' component={Account}/>
      </React.Fragment>
    );
  }
}

export default withServerContext(Main);
