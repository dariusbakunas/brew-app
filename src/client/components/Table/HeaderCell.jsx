import React from 'react';
import PropTypes from 'prop-types';

function HeaderCell({ children }) {
  return (
    <th>
      {children}
    </th>
  );
}

HeaderCell.propTypes = {
  children: PropTypes.node,
};

export default HeaderCell;
