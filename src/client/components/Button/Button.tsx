import classNames from 'classnames';
import React from 'react';
import Icon from '../Icon';

interface IButtonProps {
  className?: string;
  children?: React.ReactNode | string;
  disabled?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  type?: 'button' | 'submit';
  variation?: 'default' | 'primary' | 'secondary' | 'danger' | 'text' | 'link';
}

function Button(props: IButtonProps) {
  const {
    children, className, disabled, icon, iconPosition, onClick, type, variation,
  } = props;

  const classes = classNames(
    'uk-button',
    { icon: !!icon },
    { [`uk-button-${variation}`]: !icon },
    className,
  );

  return (
    <button className={classes} type={type} disabled={disabled} onClick={onClick}>
      {
        icon ?
          <React.Fragment>
            {iconPosition === 'right' ? <span>{children}</span> : null}
            <span className='uk-icon'>
              <Icon icon={icon} width={20}/>
            </span> {iconPosition === 'left' ? <span>{children}</span> : null}
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
