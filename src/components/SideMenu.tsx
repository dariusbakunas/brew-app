import React, { ReactNode, useContext } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import { useRouter } from 'next/router';
import LayoutContext, { ILayoutContext } from '../context/LayoutContext';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import HopIcon from '../icons/HopIcon';
import FermentableIcon from '../icons/FermentableIcon';
import YeastIcon from '../icons/YeastIcon';
import WaterIcon from '../icons/WaterIcon';

const useStyles = makeStyles<Theme, { drawerWidth: number }>(theme => ({
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    overflow: 'auto',
  },
  drawer: {
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: props => ({
    width: props.drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  drawerClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
}));

interface SideMenuProps {
  header?: (context: ILayoutContext) => ReactNode;
  children?: ReactNode;
}

export const SideMenu: React.FC<SideMenuProps> = ({ children, header }) => {
  const layoutContext = useContext(LayoutContext)!;
  const { drawerWidth, opened, setOpened } = layoutContext;
  const router = useRouter();
  const classes = useStyles({
    drawerWidth,
  });
  const { pathname, push } = router;

  const handleNavigate = (route: string) => {
    push({
      pathname: route,
    });
  };

  return (
    <Drawer
      anchor="left"
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: opened,
        [classes.drawerClose]: !opened,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: opened,
          [classes.drawerClose]: !opened,
        }),
      }}
      open={opened}
      onClose={() => setOpened(false)}
    >
      <div className={classes.appBarSpacer} />
      <Divider />
      <List>
        <ListItem selected={pathname === '/'} button onClick={() => handleNavigate('/')}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" primaryTypographyProps={{ noWrap: true }} />
        </ListItem>
        <ListItem selected={pathname === '/hops'} button onClick={() => handleNavigate('/hops')}>
          <ListItemIcon>
            <HopIcon />
          </ListItemIcon>
          <ListItemText primary="Hops" primaryTypographyProps={{ noWrap: true }} />
        </ListItem>
        <ListItem selected={pathname === '/fermentables'} button onClick={() => handleNavigate('/fermentables')}>
          <ListItemIcon>
            <FermentableIcon />
          </ListItemIcon>
          <ListItemText primary="Fermentables" primaryTypographyProps={{ noWrap: true }} />
        </ListItem>
        <ListItem selected={pathname === '/yeast'} button onClick={() => handleNavigate('/yeast')}>
          <ListItemIcon>
            <YeastIcon />
          </ListItemIcon>
          <ListItemText primary="Yeast" primaryTypographyProps={{ noWrap: true }} />
        </ListItem>
        <ListItem selected={pathname === '/water'} button onClick={() => handleNavigate('/water')}>
          <ListItemIcon>
            <WaterIcon />
          </ListItemIcon>
          <ListItemText primary="Water" primaryTypographyProps={{ noWrap: true }} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default SideMenu;
