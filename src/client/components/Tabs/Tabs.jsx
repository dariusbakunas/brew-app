import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

function Tabs(props) {
  const { align, className, children } = props;

  const classes = classNames(
    'uk-tab',
    { [`uk-flex-${align}`]: align },
    className,
  );

  return (
    <ul className={classes}>
      {children}
    </ul>
  );
}

Tabs.propTypes = {
  align: PropTypes.oneOf(['left', 'center', 'right']),
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Tabs;
