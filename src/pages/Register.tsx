import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { createStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    header: {
      fontWeight: 300,
    },
    root: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      width: '400px',
    },
    grid: {
      flexGrow: 1,
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    dense: {
      marginTop: 19,
    },
    button: {
      marginTop: theme.spacing(2),
    },
    menu: {
      width: 200,
    },
  })
);

interface RegisterState {
  code: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
}

const Register: React.FC = () => {
  const classes = useStyles({});

  const [values, setValues] = React.useState<RegisterState>({
    code: '',
    email: '',
    firstName: '',
    lastName: '',
    username: '',
  });

  const handleChange = (name: keyof RegisterState) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValues({ ...values, [name]: event.target.value });
  };

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        className={classes.grid}
      >
        <Grid item>
          <Typography variant="h4" gutterBottom className={classes.header}>
            CREATE NEW ACCOUNT
          </Typography>
        </Grid>
        <Grid item>
          <form autoComplete="off" className={classes.form}>
            <TextField
              id="username"
              label="Username"
              className={classes.textField}
              value={values.username}
              onChange={handleChange('username')}
              margin="normal"
            />
            <TextField
              id="email"
              label="Email"
              className={classes.textField}
              value={values.email}
              onChange={handleChange('email')}
              margin="normal"
            />
            <TextField
              id="fname"
              label="First Name"
              className={classes.textField}
              value={values.firstName}
              onChange={handleChange('firstName')}
              margin="normal"
            />
            <TextField
              id="lname"
              label="Last Name"
              className={classes.textField}
              value={values.lastName}
              onChange={handleChange('lastName')}
              margin="normal"
            />
            <TextField
              id="code"
              label="Invitation Code"
              className={classes.textField}
              value={values.code}
              onChange={handleChange('code')}
              margin="normal"
            />
            <Button className={classes.button} variant="contained" color="primary">
              Submit
            </Button>
          </form>
        </Grid>
      </Grid>
    </div>
  );
};

export default Register;
