import React from 'react';
import PropTypes from 'prop-types';

function Cell({ children }) {
  return (
    <td>
      {children}
    </td>
  );
}

Cell.propTypes = {
  children: PropTypes.node,
};

export default Cell;
