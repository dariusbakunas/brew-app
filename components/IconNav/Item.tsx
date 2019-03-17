import React from 'react';
import classNames from 'classnames';
import Icon from '../Icon';

type ItemProps = {
  icon: string,
  disabled?: boolean,
  onClick: (e: React.MouseEvent<HTMLElement>) => void,
};

function Item(props: ItemProps) {
  const { disabled, icon, onClick } = props;

  const classes = classNames(
    'uk-icon',
    { 'uk-disabled': disabled },
  );

  return (
    <li>
      <a href='#' className={classes} onClick={onClick}>
        <Icon className='uk-preserve-width' icon={icon} width='20px' height='20px'/>
      </a>
    </li>
  );
}

export default Item;
