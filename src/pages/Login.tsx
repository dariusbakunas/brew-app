import React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'next/router';
import {
  ExcludeRouterProps,
  WithRouterProps,
} from 'next/dist/client/with-router';
import { makeStyles, Theme } from '@material-ui/core';
import { NextPage } from 'next';
import HopIcon from '../icons/HopIcon';
import quotes from '../config/quotes';

const useStyles = makeStyles<Theme>(theme => ({
  root: {},
  logo: {
    width: '4em',
    height: '4em',
    fill: '#9FB03E',
    stroke: '#9FB03E',
  },
  header: {
    fontWeight: 300,
  },
  quote: {
    maxWidth: '500px',
    '& p': {
      fontStyle: 'italic',
      fontSize: '1.25rem',
      fontWeight: 300,
      marginBottom: theme.spacing(1),
    },
    '& cite': {
      color: '#666',
      fontStyle: 'italic',
      fontWeight: 300,
    },
  },
}));

interface LoginProps extends WithRouterProps {
  quote: { author: string; text: string };
}

const Login: NextPage<LoginProps, ExcludeRouterProps<LoginProps>> = ({
  quote,
  router,
}) => {
  const classes = useStyles({});

  const handleLoginClick = () => {
    router.push({
      pathname: '/auth/login',
    });
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      className={classes.root}
    >
      <Grid item>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          className={classes.header}
        >
          BREW BEER
        </Typography>
      </Grid>
      <Grid item>
        <IconButton aria-label="login" onClick={handleLoginClick}>
          <HopIcon className={classes.logo} />
        </IconButton>
      </Grid>
      <Grid item>
        {quote && (
          <blockquote className={classes.quote}>
            <p>
              <q>{quote.text}</q>
            </p>
            <footer>
              <cite>&mdash;{quote.author}</cite>
            </footer>
          </blockquote>
        )}
      </Grid>
    </Grid>
  );
};

Login.getInitialProps = async ctx => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  return { quote: randomQuote };
};

export default withRouter<LoginProps>(Login);
