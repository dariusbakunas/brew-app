import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

function Card(props) {
  const {
    children, hover, title, variation, className,
  } = props;

  const classes = classNames(
    className,
    'uk-card',
    { [`uk-card-${variation}`]: variation },
    'uk-card-body',
    { 'uk-card-hover': hover },
  );

  return (
    <div className={classes}>
      {
        title &&
        <h3 className="uk-card-title">{title}</h3>
      }
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  hover: PropTypes.bool,
  title: PropTypes.string,
  variation: PropTypes.oneOf(['default', 'primary', 'secondary']),
};

export default Card;
