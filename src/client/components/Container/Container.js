import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function Container(props) {
  const { children, size } = props;

  const classes = classNames(
    'uk-container',
    { [`uk-container-${size}`]: size },
  );

  return (
    <div className={classes}>
      {children}
    </div>
  );
}

Container.propTypes = {
  children: PropTypes.node,
  size: PropTypes.oneOf(['xsmall', 'small', 'large', 'expand']),
};

export default Container;
