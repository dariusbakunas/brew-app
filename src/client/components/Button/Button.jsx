import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import getUnhandledProps from '../../utils/getUnhandledProps';

function Button(props) {
  const {
    children, className, link, type, variation,
  } = props;
  const Element = link ? 'a' : 'button';

  const classes = classNames(
    'uk-button',
    { [`uk-button-${variation}`]: variation },
    className,
  );

  const rest = getUnhandledProps(Button, props);

  return (
    <Element className={classes} type={type} {...rest}>{children}</Element>
  );
}

Button.defaultProps = {
  type: 'button',
  variation: 'default',
};

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  link: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit']),
  variation: PropTypes.oneOf(['default', 'primary', 'secondary', 'danger', 'text', 'link']),
};

export default Button;
