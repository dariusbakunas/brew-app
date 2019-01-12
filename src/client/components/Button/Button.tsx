import React, { ReactNode } from 'react';
import classNames from 'classnames';
import getUnhandledProps from '../../utils/getUnhandledProps';
import Icon from '../Icon';

type ButtonProps = {
  className?: string,
  children: ReactNode | string,
  icon?: string,
  iconPosition?: 'left' | 'right',
  onClick: (e: React.MouseEvent<HTMLElement>) => void,
  type?: 'button' | 'submit',
  variation?: 'default' | 'primary' | 'secondary' | 'danger' | 'text' | 'link'
};

function Button(props: ButtonProps) {
  const {
    children, className, icon, iconPosition, type, variation,
  } = props;

  const classes = classNames(
    'uk-button',
    { icon: !!icon },
    { [`uk-button-${variation}`]: !icon },
    className,
  );

  const rest = getUnhandledProps(Button, props);

  return (
    <button className={classes} type={type} {...rest}>
      {
        icon ?
          <React.Fragment>
            {iconPosition === 'right' ? <span>{children}</span> : null} <span className='uk-icon'><Icon icon={icon} width={20}/></span> {iconPosition === 'left' ? <span>{children}</span> : null}
          </React.Fragment> : children
      }
    </button>
  );
}

Button.defaultProps = {
  iconPosition: 'left',
  type: 'button',
  variation: 'default',
};

export default Button;
