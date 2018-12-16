import React from 'react';
import PropTypes from 'prop-types';

function Header(props) {
  const { label } = props;

  return (
    <li className='uk-nav-header'>{label}</li>
  );
}

Header.propTypes = {
  label: PropTypes.string.isRequired,
};

export default Header;
