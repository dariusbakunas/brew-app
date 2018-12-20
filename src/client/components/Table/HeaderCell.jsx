import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function HeaderCell(props) {
  const {
    children, className, nowrap, shrink,
  } = props;

  const classes = classNames(
    className,
    { 'uk-table-shrink': shrink },
    { 'uk-text-nowrap': nowrap },
  );

  return (
    <th className={classes}>
      {children}
    </th>
  );
}

HeaderCell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  nowrap: PropTypes.bool,
  shrink: PropTypes.bool,
};

export default HeaderCell;
