import React from 'react';
import { Grid, makeStyles, Theme } from '@material-ui/core';
import Link from './Link';

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    padding: theme.spacing(1),
  },
}));

const Footer: React.FC = () => {
  const classes = useStyles({});

  return (
    <Grid container justify="center" spacing={1} className={classes.root}>
      <Grid item>
        <Link href="/privacy" label="Privacy" />
      </Grid>
      <Grid item>
        <Link href="/terms" label="Terms of Use" />
      </Grid>
    </Grid>
  );
};

export default Footer;
