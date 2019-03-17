import React from 'react';
import classNames from 'classnames';
import Icon from '../Icon';

type NavbarProps = {
  toggleTarget: string,
  transparent?: boolean,
};

const Navbar: React.FunctionComponent<NavbarProps> = (props: NavbarProps) => {
  const { toggleTarget, transparent } = props;

  const classes = classNames(
    'uk-navbar',
    'uk-navbar-container',
    { 'uk-navbar-transparent': transparent },
  );

  return (
    <nav className={classes}>
      <div className='uk-navbar-left'>
        <a className='uk-navbar-toggle uk-navbar-toggle-icon uk-icon' href='' data-uk-toggle={`target: #${toggleTarget}`}>
          <Icon icon='menu' width='20' height='20'/>
        </a>
      </div>
      <div className='uk-navbar-center'>
        <Icon className='centerNavLogo' icon='logo' width='20'/><span className='uk-navbar-item uk-logo'>BREW BEER</span>
      </div>
    </nav>
  );
};

export default Navbar;
