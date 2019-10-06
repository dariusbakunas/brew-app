import React from 'react';
import NextLink from 'next/link';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles<Theme>(theme => ({
  button: {
    textTransform: 'none',
  },
}));

interface LinkProps {
  href: string;
  label: string;
}

const Link: React.FC<LinkProps> = ({ href, label }) => {
  const classes = useStyles({});

  return (
    <NextLink href={href} passHref>
      <Button component="a" className={classes.button}>
        {label}
      </Button>
    </NextLink>
  );
};

export default Link;
