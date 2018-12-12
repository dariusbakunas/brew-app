import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import getUnhandledProps from '../../utils/getUnhandledProps';

function Column(props) {
  const { children } = props;

  const classes = classNames(
    'column',
  );

  const rest = getUnhandledProps(Column, props);

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

Column.propTypes = {
  children: PropTypes.node,
};

export default Column;
