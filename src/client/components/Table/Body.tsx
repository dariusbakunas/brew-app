import React, { ReactNode } from 'react';

type BodyProps = {
  children: ReactNode
};

function Body({ children }: BodyProps) {
  return (
    <tbody>
      {children}
    </tbody>
  );
}

export default Body;
