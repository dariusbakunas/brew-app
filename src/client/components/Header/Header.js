import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TEXT_ALIGNMENTS } from '../../../contants';

function Header(props) {
  const { as: Element, children, className, textAlign } = props;

  const classes = classNames(
    { [`uk-text-${textAlign}`]: textAlign },
    className,
  );

  return (
    <Element className={classes}>{children}</Element>
  );
}

Header.defaultProps = {
  as: 'h1',
};

Header.propTypes = {
  as: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5']).isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  textAlign: PropTypes.oneOf(TEXT_ALIGNMENTS),
};

export default Header;
