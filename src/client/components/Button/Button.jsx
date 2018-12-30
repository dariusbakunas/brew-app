import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ICONS } from '../../../contants';
import getUnhandledProps from '../../utils/getUnhandledProps';
import Icon from '../Icon';

function Button(props) {
  const {
    children, className, icon, iconPosition, link, type, variation,
  } = props;
  const Element = link ? 'a' : 'button';

  const classes = classNames(
    'uk-button',
    { icon: !!icon },
    { [`uk-button-${variation}`]: !icon },
    className,
  );

  const rest = getUnhandledProps(Button, props);

  return (
    <Element className={classes} type={type} {...rest}>
      {
        icon ?
          <React.Fragment>
            {iconPosition === 'right' ? <span>{children}</span> : null} <span className='uk-icon'><Icon icon={icon} width={20}/></span> {iconPosition === 'left' ? <span>{children}</span> : null}
          </React.Fragment> : children
      }
    </Element>
  );
}

Button.defaultProps = {
  iconPosition: 'left',
  type: 'button',
  variation: 'default',
};

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  icon: PropTypes.oneOf(ICONS),
  iconPosition: PropTypes.oneOf(['left', 'right']),
  link: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit']),
  variation: PropTypes.oneOf(['default', 'primary', 'secondary', 'danger', 'text', 'link']),
};

export default Button;
