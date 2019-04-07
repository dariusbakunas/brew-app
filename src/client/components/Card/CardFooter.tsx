import React, { ReactNode } from 'react';

interface ICardHeaderProps {
  children: ReactNode;
}

function CardFooter(props: ICardHeaderProps) {
  const { children } = props;

  return (
    <div className='uk-card-footer'>
      {children}
    </div>
  );
}

export default CardFooter;
