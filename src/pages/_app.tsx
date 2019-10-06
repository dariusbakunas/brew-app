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

interface IPageProps {
  user?: {
    displayName: string;
    id: string;
    user_id: string;
    emails: Array<{ value: string }>;
    picture: string;
    nickname: string;
  };
}

const styles = (theme: Theme) => ({
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  root: {
    display: 'flex',
    backgroundColor: '#EEEEEE',
  },
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

    if (
      request &&
      request.session &&
      request.session.passport &&
      request.session.passport.user
    ) {
      pageProps.user = request.session.passport.user.profile;
    } else {
      const baseURL = request
        ? `${request.protocol}://${request.get('Host')}`
        : '';
      const res = await fetch(`${baseURL}/auth/user`);
      pageProps.user = await res.json();
    }

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
          <main className={classes.content}>
            <Component {...pageProps} />
          </main>
        </Root>
      </React.Fragment>
    );
  }
}

export default withStyles(styles(themeConfig))(BrewApp);
