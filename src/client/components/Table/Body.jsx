import React from 'react';
import PropTypes from 'prop-types';

function Body({ children }) {
  return (
    <tbody>
      {children}
    </tbody>
  );
}

Body.propTypes = {
  children: PropTypes.node
};

export default Body;
