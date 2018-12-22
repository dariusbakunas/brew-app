import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../Icon';

function Item(props) {
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

Item.propTypes = {
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default Item;
