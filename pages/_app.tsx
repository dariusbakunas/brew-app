import { ApolloClient } from 'apollo-client';
import App, { Container } from 'next/app';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Nav, SideMenu } from '../components';
import withApolloClient from '../lib/apollo';
import '../styles/main.scss';

interface IAppProps {
  apolloClient: ApolloClient<any>;
}

class MainApp extends App<IAppProps> {
  public static async getInitialProps({ Component, ctx }) {
    let pageProps = {
      currentUser: null,
    };

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const { req } = ctx;

    if (!!req) {
      const { user } = req;

      if (user) {
        pageProps.currentUser = {
          email: user.email,
          isAdmin: user.isAdmin,
          status: user.status,
        };
      }

      return { pageProps };
    } else {
      const res = await fetch('/currentUser', {
        headers: { Accept: 'application/json' },
      });

      const user = await res.json();
      pageProps.currentUser = {
        email: user.email,
        isAdmin: user.isAdmin,
        status: user.status,
      };

      return { pageProps };
    }
  }

  public state = {
    showSideBar: false,
  };

  public componentDidMount(): void {
    window.UIkit = require('uikit');
  }

  public render() {
    const {Component, pageProps, apolloClient} = this.props;
    const {currentUser} = pageProps;

    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps}/>

          {currentUser &&
          <SideMenu
            id='side-menu'
            visible={this.state.showSideBar}
            overlay={true}
            mode='slide'
            onShow={() => this.setShowSideBar(true)}
            onHide={() => this.setShowSideBar(false)}
          >
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
          }
        </ApolloProvider>
      </Container>
    );
  }

  private setShowSideBar(show) {
    this.setState({
      showSideBar: show,
    });
  }
}

export default withApolloClient(MainApp, {});
