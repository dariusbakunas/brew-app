import classNames from 'classnames';
import React from 'react';
import Icon from '../Icon';

interface IItemProps {
  icon: string;
  disabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  ratio?: number;
}

function Item(props: IItemProps) {
  const { disabled, icon, onClick, ratio = 1 } = props;

  const classes = classNames(
    'uk-icon',
    { 'uk-disabled': disabled },
  );

  const width = 20 * ratio;
  const height = 20 * ratio;

  return (
    <li>
      <a href='#' className={classes} onClick={onClick}>
        <Icon className='uk-preserve-width' icon={icon} width={width} height={height}/>
      </a>
    </li>
  );
}

export default Item;
