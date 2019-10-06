import { red, indigo } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#CFD8DC',
      main: '#607D8B',
      dark: '#455A64',
    },
    secondary: {
      main: '#343240',
    },
    error: {
      main: red.A400,
    },
    text: {
      primary: '#3c3f40',
    },
    background: {
      paper: '#fff',
      default: '#F0F2F2',
    },
  },
  typography: {
    fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
  },
});

export default theme;
