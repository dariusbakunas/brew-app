import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

function Tabs(props) {
  const { className, children } = props;

  const classes = classNames(
    'uk-tab',
    className,
  );

  return (
    <ul className={classes}>
      {children}
    </ul>
  );
}

Tabs.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Tabs;
