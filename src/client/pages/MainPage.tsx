import React from 'react';
import { Route } from 'react-router-dom';
import { User } from '../../types';
import { Nav, Navbar, SideMenu } from '../components';
import withServerContext from '../HOC/withServerContext';
import Dashboard from './Dashboard';
import EditRecipePage from './EditRecipePage';
import IngredientsPage from './IngredientsPage';
import Invitations from './InvitationsPage';
import Profile from './Profile';
import RecipesPage from './RecipesPage';
import Roles from './RolesPage';
import Users from './UsersPage';

interface IMainPageProps {
  user: User;
}

interface IMainPageState {
  showSideBar: boolean;
}

class MainPage extends React.Component<IMainPageProps> {
  public readonly state: Readonly<IMainPageState> = {
    showSideBar: false,
  };

  public render() {
    return (
      <React.Fragment>
        <Navbar toggleTarget='side-menu'/>
        <div className='main-container'>
          <SideMenu
            id='side-menu'
            overlay={true}
            mode='slide'
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
              {
                this.props.user.isAdmin &&
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
          <Route path='/' exact={true} component={Dashboard}/>
          <Route path='/profile' component={Profile}/>
          <Route path='/recipes' exact={true} component={RecipesPage}/>
          <Route path='/recipes/:id' component={EditRecipePage}/>
          {
            this.props.user.isAdmin &&
            <React.Fragment>
              <Route path='/users' component={Users}/>
              <Route path='/roles' component={Roles}/>
              <Route path='/invitations' component={Invitations}/>
              <Route path='/ingredients' component={IngredientsPage}/>
            </React.Fragment>
          }
        </div>
      </React.Fragment>
    );
  }

  private showSideBar = () => {
    this.setState({ showSideBar: true });
  }

  private hideSideBar = () => {
    this.setState({ showSideBar: false });
  }
}

export default withServerContext(MainPage);
