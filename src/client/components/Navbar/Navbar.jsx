import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from '../Icon';

function Navbar(props) {
  const { transparent } = props;

  const classes = classNames(
    'uk-navbar',
    'uk-navbar-container',
    { 'uk-navbar-transparent': transparent },
  );

  return (
    <nav className={classes}>
      <div className='uk-navbar-left'>
        <a className='uk-navbar-toggle uk-navbar-toggle-icon uk-icon' href='' data-uk-toggle='target: #offcanvas-usage'>
          <Icon icon='menu' width='20' height='20'/>
        </a>
      </div>
      <div className='uk-navbar-center'>
        <Icon className='centerNavLogo' icon='logo' width='20'/><span className='uk-navbar-item uk-logo'>BREW BEER</span>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  transparent: PropTypes.bool,
};

export default Navbar;
