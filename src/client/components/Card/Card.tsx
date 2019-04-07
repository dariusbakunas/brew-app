import classNames from 'classnames';
import React, { ReactNode } from 'react';
import CardBody from './CardBody';
import CardFooter from './CardFooter';
import CardHeader from './CardHeader';

interface ICardProps {
  children: ReactNode;
  hover?: boolean;
  className?: string;
  variation?: 'default' | 'primary' | 'secondary';
}

function Card(props: ICardProps) {
  const {
    children, hover, variation, className,
  } = props;

  const classes = classNames(
    className,
    'uk-card',
    `uk-card-${variation || 'default'}`,
    { 'uk-card-hover': hover },
  );

  return (
    <div className={classes}>
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
