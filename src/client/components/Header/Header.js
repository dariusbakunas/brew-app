import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TEXT_ALIGNMENTS } from '../../../contants';

function Header(props) {
  const { as: Element, children, textAlign } = props;

  const classes = classNames(
    { [textAlign === 'justified' ? 'justified' : `${textAlign} aligned`]: textAlign },
    'header',
  );

  return (
    <Element className={classes}>{children}</Element>
  );
}

Header.propTypes = {
  as: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).isRequired,
  textAlign: PropTypes.oneOf([TEXT_ALIGNMENTS]),
  children: PropTypes.node,
};

export default Header;
