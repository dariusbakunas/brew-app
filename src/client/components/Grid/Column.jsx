import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

function Column(props) {
  const { children, ...rest } = props;

  const classes = classNames(
    'column',
  );

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
