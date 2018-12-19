import React from 'react';
import PropTypes from 'prop-types';

function Header({ children }) {
  return (
    <thead>
      {children}
    </thead>
  );
}

Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
