import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ICONS } from '../../../contants';
import getUnhandledProps from '../../utils/getUnhandledProps';
import Icon from '../Icon';

function Button(props) {
  const {
    children, className, icon, link, type, variation,
  } = props;
  const Element = link ? 'a' : 'button';

  const classes = classNames(
    'uk-button',
    { icon: variation === 'icon' },
    { [`uk-button-${variation}`]: variation !== 'icon' },
    className,
  );

  const rest = getUnhandledProps(Button, props);

  return (
    <Element className={classes} type={type} {...rest}>
      {
        variation === 'icon' && icon ?
          <span className='uk-icon'><Icon icon={icon} width={20}/></span> : children
      }
    </Element>
  );
}

Button.defaultProps = {
  type: 'button',
  variation: 'default',
};

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  icon: PropTypes.oneOf(ICONS),
  link: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit']),
  variation: PropTypes.oneOf(['default', 'primary', 'secondary', 'danger', 'text', 'link', 'icon']),
};

export default Button;
