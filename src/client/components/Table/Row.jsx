import React from 'react';
import PropTypes from 'prop-types';

function Row({ children }) {
  return (
    <tr>
      {children}
    </tr>
  );
}

Row.propTypes = {
  children: PropTypes.node,
};

export default Row;
