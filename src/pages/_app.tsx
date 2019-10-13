import React from 'react';
import { Request } from 'express';
import App from 'next/app';
import Head from 'next/head';
import fetch from 'isomorphic-fetch';
import { withStyles } from '@material-ui/styles';
import Router from 'next/router';
import { WithApolloProps } from 'next-with-apollo';
import { Theme } from '@material-ui/core';

import { AppContextType } from 'next/dist/next-server/lib/utils';
import themeConfig from '../config/theme';
import Root from '../components/Root';
import getUser, { IUser } from '../auth/getUser';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu'

interface IPageProps {
  user?: IUser;
}

const styles = (theme: Theme) => ({
  '@global': {
    html: {
      height: '100%',
    },
    body: {
      minHeight: '100%',
    },
    '#__next': {
      minHeight: '100%',
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {},
});

interface IState {
  sideMenuOpen: boolean;
}

interface IProps extends WithApolloProps<any> {
  classes: any;
}

class BrewApp extends App<IProps, IState> {
  readonly state = { sideMenuOpen: false };

  static async getInitialProps({ Component, ctx }: AppContextType) {
    let pageProps: IPageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const request: Request = ctx.req as Request;

    pageProps.user = await getUser(request);

    return { pageProps };
  }

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  handleNavigate = (url: string) => {
    Router.push({
      pathname: url,
    });
  };

  setSideMenuOpen = (open: boolean) => {
    this.setState({
      sideMenuOpen: open,
    });
  };

  render() {
    const { classes, Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>Brew APP</title>
        </Head>
        <Root>
          {!!pageProps.user && (
            <React.Fragment>
              <Header
                isAuthenticated={true}
                title="Brew Beer"
                onLogoutClick={() => this.handleNavigate('/auth/logout')}
                user={pageProps.user}
              />
              <SideMenu />
            </React.Fragment>
          )}
          <main className={classes.content}>
            {pageProps.user && <div className={classes.appBarSpacer} />}
            <Component {...pageProps} />
          </main>
        </Root>
      </React.Fragment>
    );
  }
}

export default withStyles(styles(themeConfig))(BrewApp);
