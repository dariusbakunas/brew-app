import React, { ReactNode } from 'react';

interface ICardBodyProps {
  children: ReactNode;
}

function CardBody(props: ICardBodyProps) {
  const { children } = props;

  return (
    <div className='uk-card-body'>
      {children}
    </div>
  );
}

export default CardBody;
