import React, { ReactNode } from 'react';

interface ICardHeaderProps {
  children: ReactNode;
}

function CardHeader(props: ICardHeaderProps) {
  const { children } = props;

  return (
    <div className='uk-card-header'>
      {children}
    </div>
  );
}

export default CardHeader;
