import React, { ReactNode } from 'react';
import classNames from 'classnames';

type CardProps = {
  children: ReactNode,
  hover?: boolean,
  className?: string,
  title?: string,
  variation: 'default' | 'primary' | 'secondary'
};

function Card(props: CardProps) {
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

export default Card;
