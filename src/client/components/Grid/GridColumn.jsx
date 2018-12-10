import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import getUnhandledProps from '../../utils/getUnhandledProps';

function GridColumn(props) {
  const { children } = props;

  const classes = classNames(
    'column',
  );

  const rest = getUnhandledProps(GridColumn, props);

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

GridColumn.propTypes = {
  children: PropTypes.node,
};

export default GridColumn;
