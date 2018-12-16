import React from 'react';
import PropTypes from 'prop-types';
import withServerContext from '../HOC/withServerContext';
import { USER_STATUS } from '../../contants';
import Navbar from '../components/Navbar';
import SideMenu from '../components/SideMenu';
import Nav from '../components/Nav';

class Main extends React.Component {
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
        <Navbar toggleTarget='side-menu'/>
        <SideMenu id='side-menu' overlay={true} mode='push'>
            <Nav>
              <Nav.Header label='Account'/>
              <Nav.Item label='Profile' url='/profile'/>
              <Nav.Item as='a' label='Log Out' url='/logout'/>
            </Nav>
        </SideMenu>
      </React.Fragment>
    );
  }
}

export default withServerContext(Main);
