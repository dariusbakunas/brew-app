import React, { useState } from 'react';
import { Nav, Navbar, SideMenu } from '../components';

const Main = ({ children, currentUser }) => {
  const [showSideBar, setShowSideBar] = useState(false);

  return (
    <React.Fragment>
      <Navbar toggleTarget='side-menu'/>
      <div className='main-container'>
        <SideMenu
          id='side-menu'
          overlay={true}
          mode='slide'
          visible={showSideBar}
          onShow={() => setShowSideBar(true)}
          onHide={() => setShowSideBar(false)}>
          <Nav>
            <Nav.Header label='Brew'/>
            <Nav.Item label='Dashboard' url='/'/>
            <Nav.Item label='Inventory' url='/inventory'/>
            <Nav.Item label='Recipes' url='/recipes'/>
            <Nav.Item label='Sessions' url='/sessions'/>
            <Nav.Item label='Tools' url='/tools'/>
            {
              currentUser.isAdmin &&
                <React.Fragment>
                  <Nav.Header label='Admin'/>
                  <Nav.Item label='Users' url='/users'/>
                  <Nav.Item label='Roles' url='/roles'/>
                  <Nav.Item label='Invitations' url='/invitations'/>
                  <Nav.Header label='Ingredients'/>
                  <Nav.Item label='Hops' url='/ingredients/hops'/>
                  <Nav.Item label='Fermentables' url='/ingredients/fermentables'/>
                  <Nav.Item label='Yeast' url='/ingredients/yeast'/>
                  <Nav.Item label='Water' url='/ingredients/water'/>
                </React.Fragment>
            }
            <Nav.Header label='Account'/>
            <Nav.Item label='Settings & Profile' url='/profile'/>
            <Nav.Item as='a' label='Logout' url='/logout'/>
          </Nav>
        </SideMenu>
        {children}
      </div>
    </React.Fragment>
  );
};

export default Main;
